import asyncio
import requests
from config import Config

from services.graph.connector import Neo4jConnector
from services.llm.llm_model import LLMClient
from services.graph.models import Entities
from services.prompt.extraction_entities import extract_entities_prompt

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
