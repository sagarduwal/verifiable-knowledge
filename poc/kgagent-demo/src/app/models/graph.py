from typing import Text
from pydantic import BaseModel, Field

class Graph(BaseModel):
    document_id: Text = Field(description="Document ID")
    