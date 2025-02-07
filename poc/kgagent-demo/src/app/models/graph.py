from typing import Text
from pydantic import BaseModel, Field


class GraphModel(BaseModel):
    document_id: Text = Field(description="Document ID")
