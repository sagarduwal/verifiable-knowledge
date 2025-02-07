from typing import Text
from enum import Enum
from pydantic import BaseModel


class Node(BaseModel):
    node_id: int
    name: Text
    import_name: Text
    label: Text = "node"
    description: Text
    document_id: Text


class Relationship(BaseModel):
    source: Text
    destination: Text
    label: Text


class ActionEnum(Enum):
    ADD = "add"
    UPDATE = "update"
    DELETE = "delete"


class NodeAction(BaseModel):
    action: Text = ActionEnum.ADD.value
    node: Node
