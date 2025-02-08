from typing import List

from services.graph.models import Node, Relationship, NodeAction, ActionEnum


class GraphDataFormatter:
    nodes: List[NodeAction] = []
    relationships: List[Relationship] = []
    nodes_count: int = 0

    def __init__(self):
        pass

    @classmethod
    def clear_nodes_and_relationships(cls):
        cls.nodes_count = 0
        cls.nodes = []
        cls.relationships = []

    @classmethod
    def __create_node_id(cls):
        return cls.nodes_count + len(cls.nodes)

    @classmethod
    def add_nodes_and_relationships(cls, data, document_id, max_node_id):
        try:
            cls.nodes_count = max_node_id
            for item in data["nodes"]:
                cls.nodes.append(
                    NodeAction(
                        action=ActionEnum.ADD.value,
                        node=Node(
                            node_id=cls.__create_node_id(),
                            name=item["description"],
                            import_name=item["description"],
                            description=item["description"],
                            document_id=document_id,
                        ),
                    )
                )
            for item in data["relationships"]:
                cls.relationships.append(
                    Relationship(
                        source=item["source"],
                        destination=item["destination"],
                        label="rel",
                    )
                )
        except Exception as e:
            print(f"Error adding the nodes and relationships \n {str(e)}")
            raise (e)

    @classmethod
    def update_nodes_relationships(cls, combined_node_map, is_intra_document):
        try:
            nodes_to_combine = list(combined_node_map.keys())
            if is_intra_document:
                cls.nodes = list(
                    filter(
                        lambda x: str(x.node.node_id) not in nodes_to_combine, cls.nodes
                    )
                )
            else:

                def update_node_action(node):
                    if str(node.node.node_id) in nodes_to_combine:
                        node.action = ActionEnum.UPDATE.value
                        node.node.node_id = int(
                            combined_node_map[str(node.node.node_id)]
                        )
                    return node

                cls.nodes = list(map(update_node_action, cls.nodes))

            for item in cls.relationships:
                if item.source in nodes_to_combine:
                    item.source = combined_node_map[item.source]
                if item.destination in nodes_to_combine:
                    item.destination = combined_node_map[item.destination]

        except Exception as e:
            print(f"Error updating the nodes and relationships \n {str(e)}")
            raise (e)
