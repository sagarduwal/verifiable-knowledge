from config import Config
from langchain_community.graphs.neo4j_graph import Neo4jGraph


class Neo4jConnector:
    def __init__(
        self,
        username: str,
        password: str,
        url: str,
    ):
        self.graph = Neo4jGraph(url=url, username=username, password=password)

    def get_schema(self):
        return self.graph.schema

    def refresh_schema(self):
        self.graph.refresh_schema()

    def execute_query(self, query):
        return self.graph.query(query=query)

    def execute_queries(self, queries):
        for query in queries:
            self.execute_query(query)

    def retrieve_relationship(self, entities, document_ids=None):
        if not entities:
            return ""
        document_filter = ""
        if document_ids:
            document_filter = f"""
                WHERE ANY(doc_id IN {document_ids} WHERE doc_id IN entity.document_id)
                AND ANY(doc_id IN {document_ids} WHERE doc_id IN neighbor.document_id)
                """
        query = f"""
            UNWIND {entities} AS entity_name
            MATCH (entity)
            WHERE toLower(REPLACE(entity_name, ' ', '')) CONTAINS toLower(REPLACE(entity.import_name, ' ', '')) 
            OR toLower(REPLACE(entity.import_name, ' ', '')) CONTAINS toLower(entity_name)
            MATCH path = (entity)-[r*1..3]->(neighbor)
            {document_filter}
            WITH entity, neighbor, [rel IN relationships(path) | type(rel)] AS rel_types
            RETURN entity.import_name + ' -> ' + apoc.text.join(rel_types, ' -> ') + ' -> ' + neighbor.import_name AS output
            UNION ALL
            UNWIND {entities} AS entity_name
            MATCH (entity)
            WHERE toLower(REPLACE(entity_name, ' ', '')) CONTAINS toLower(REPLACE(entity.import_name, ' ', '')) 
            OR toLower(REPLACE(entity.import_name, ' ', '')) CONTAINS toLower(entity_name)
            MATCH path = (neighbor)-[r*1..3]->(entity)
            {document_filter}
            WITH entity, neighbor, [rel IN relationships(path) | type(rel)] AS rel_types
            RETURN toLower(neighbor.import_name) + ' -> ' + apoc.text.join(rel_types, ' -> ') + ' -> ' + toLower(entity.import_name) AS output
        """
        response = self.execute_query(query)

        if response:
            return "\n".join([relation["output"] for relation in response])

        return ""
