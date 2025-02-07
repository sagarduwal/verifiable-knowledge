from typing import Text
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
