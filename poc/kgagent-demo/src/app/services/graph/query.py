import asyncio
from config import Config

from models import GraphModel, QueryModel

from services.graph.connector import Neo4jConnector
from services.llm.llm_model import LLMClient
from services.graph.models import Entities
from services.prompt.extraction_entities import extract_entities_prompt
from services.prompt.graph_markdown import markdown_prompt_template

from utils.document_loader import split_docs
from utils.file_operations import get_content_from_url
from utils.markdown_converter import MarkdownConverter
from utils.graph_data_formatter import GraphDataFormatter
from utils.cypher_code_generator import CypherQueryGenerator

_config = Config()
neo4j_config = _config.get_config()["GDB"]
neo4j_connector = Neo4jConnector(
    neo4j_config["USERNAME"], neo4j_config["PASSWORD"], neo4j_config["URL"]
)

llm_config = _config.get_config()["LLM"]
llm_client = LLMClient(
    llm_config["MODEL_NAME"], llm_config["TEMPERATURE"], llm_config["API_KEY"]
)


def check_doc_exists_in_graph(doc_id: str):
    query = f"""
        MATCH (d)
        WHERE '{doc_id}' IN d.document_id
        RETURN count(d) AS doc_count;
    """
    response = neo4j_connector.execute_query(query)
    return response and response[0]["doc_count"] > 0


def get_max_graph_nodes():
    query = "MATCH (d) WITH MAX(toInteger(d.node_id)) AS maxNodeId RETURN COALESCE(maxNodeId, 0) AS max_node_id"
    result = neo4j_connector.execute_query(query)
    return result[0]["max_node_id"] + 1


def get_relationships_from_query(query: str, documents):
    try:
        entities = llm_client.generate(
            prompt_template=extract_entities_prompt,
            query={"query": query},
            output_schema=Entities,
        )
        results = neo4j_connector.retrieve_relationship(
            entities=entities.names, documents=documents
        )
        return results
    except Exception as e:
        raise e


async def get_relationships_from_query_async(query: str, documents):
    try:
        entities = await llm_client.async_generate(
            prompt_template=extract_entities_prompt,
            query={"query": query},
            output_schema=Entities,
        )
        results = neo4j_connector.retrieve_relationship(
            entities=entities.names, documents=documents
        )
        return results
    except Exception as e:
        raise e


async def generate_graph(doc_content: str):
    try:
        graph_extract_response = await llm_client.async_generate(
            prompt_template=markdown_prompt_template, query={"text": doc_content}
        )
        print(f"markdown extract: {graph_extract_response}")
        md_converter = MarkdownConverter()
        graph = md_converter.process_markdown(md_text=graph_extract_response.content)
        print(f"graph: \n {graph}")
        return graph
    except Exception as e:
        raise e


async def process_graph_generate(data: dict):
    try:
        # generate graph as markdown
        doc_id = data["document_id"]
        url = data["url"]
        docs_content = get_content_from_url(url)
        print(f"docs_content: {docs_content}")

        docs_splitted = split_docs(docs_content, metadata={"document_id": doc_id})
        print(f"docs_splitted : {len(docs_splitted )}")

        tasks = [asyncio.create_task(generate_graph(doc)) for doc in docs_splitted]
        responses_gather = await asyncio.gather(*tasks)

        doc_graph = {"nodes": [], "relationships": []}
        for item in responses_gather:
            doc_graph["nodes"].extend(item["nodes"])
            doc_graph["relationships"].extend(item["relationships"])

        max_graph_node_id = get_max_graph_nodes()
        GraphDataFormatter.add_nodes_and_relationships(
            data=doc_graph,
            document_id=doc_id,
            max_node_id=max_graph_node_id,
        )

        cypher_query = CypherQueryGenerator.generate_cypher(
            nodes=GraphDataFormatter.nodes,
            relationships=GraphDataFormatter.relationships,
        )

        # execute the cypher query to insert nodes and relations to neo4j
        neo4j_connector.execute_queries(cypher_query)
        GraphDataFormatter.clear_nodes_and_relationships()  # clear the graph data
    except Exception as e:
        print(str(e))
        raise (e)


def get_graph_data(doc_id: str = None):
    try:
        document_filter = ""
        if doc_id:
            document_filter = (
                f'WHERE "{doc_id}" IN n.document_id AND "{doc_id}" IN e.document_id'
            )

        cypher_query = f"""
            MATCH rel=(n)-[r]->(e)
            {document_filter}
            WITH collect(distinct n) AS nodeListN, 
                collect(distinct e) AS nodeListE, 
                collect(distinct {{source: n.node_id, target: e.node_id, label: type(r)}}) AS relationships
            WITH apoc.coll.union(nodeListN, nodeListE) AS nodes, relationships
            RETURN nodes, relationships;
            """
        result = neo4j_connector.execute_query(cypher_query)
        return result
    except Exception as e:
        print(e)
        raise e


def get_raw_graph_data(doc_id: str):
    try:
        query = f"""
            MATCH (n)
            WHERE '{doc_id}' IN n.document_id
            MATCH (m)
            WHERE '{doc_id}' IN m.document_id
            MATCH (n)-[r]-(m)
            RETURN n, r, m
            """
        result = neo4j_connector.execute_query(query)

        return result  # [record.data() for record in result]
    except Exception as e:
        print(e)
        raise e
