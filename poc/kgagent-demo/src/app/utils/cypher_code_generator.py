import re

from services.graph.models import ActionEnum


class CypherQueryGenerator:
    def __init__(self):
        pass

    @classmethod
    def __create_node_statement(cls, node):
        try:
            node = node.model_dump()
            properties_strings = []
            for key, value in node.items():
                if key == "document_id":
                    properties_strings.append(f"""`{key}`: ['{str(value)}'] """)
                    continue
                cleaned_value = re.sub(r"[^a-zA-Z0-9 ]", "", str(value))
                properties_strings.append(f"""`{key}`: '{cleaned_value}' """)

            properties_str = ", ".join(properties_strings)
            return f"""CREATE (:`{node["label"]}` {{{properties_str}}})"""

        except Exception as e:
            print(f"Error creating node statement: {str(e)}")
            raise e

    @classmethod
    def __update_node_statement(cls, node):
        try:
            node = node.model_dump()
            description = re.sub(r"[^a-zA-Z0-9 ]", "", str(node["description"]))
            return f"""
                    MATCH (n {{node_id: '{str(node["node_id"])}'}}) SET n.description = n.description + '. {description}', 
                    n.document_id = n.document_id + '{node["document_id"]}';
                """
        except Exception as e:
            print(f"Error creating node statement: {str(e)}")
            raise e

    @classmethod
    def __create_relationship_statement(cls, relationship):
        try:
            relationship = relationship.model_dump()

            source_name = re.sub(r"[^a-zA-Z0-9 ]", "", str(relationship["source"]))
            target_name = re.sub(r"[^a-zA-Z0-9 ]", "", str(relationship["destination"]))
            relationship_label = re.sub(
                r"[^a-zA-Z0-9 ]", "", str(relationship["label"])
            )

            return (
                f"""MATCH (source {{ import_name: '{source_name}' }}), """
                f"""(destination {{ import_name: '{target_name}' }}) """
                f"""CREATE (source)-[:`{relationship_label}`]->(destination);"""
            )

        except Exception as e:
            print(f"Error creating relationship statement: {str(e)}")
            raise e

    @classmethod
    def generate_cypher(cls, nodes, relationships):
        try:
            print("Generating Cypher.........")
            cypher_statements = []
            if nodes:
                for index, node in enumerate(nodes):
                    node_statement = ""
                    if node.action == ActionEnum.ADD.value:
                        node_statement = cls.__create_node_statement(node.node)
                        if index == len(nodes) - 1:
                            node_statement += ";"
                    elif node.action == ActionEnum.UPDATE.value:
                        node_statement = cls.__update_node_statement(node.node)
                    if node_statement:
                        cypher_statements.append(node_statement)
            if relationships:
                for relationship in relationships:
                    cypher_statements.append(
                        cls.__create_relationship_statement(relationship)
                    )

                    # cypher_script = "\n".join(cypher_statements)
                print("Cypher Generated")
                return cypher_statements
            return []
        except Exception as e:
            print(f"Error generating cypher: {str(e)}")
            raise (e)
