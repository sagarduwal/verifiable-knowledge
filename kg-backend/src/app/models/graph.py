from typing import Text, Optional
from pydantic import BaseModel, Field


class GraphModel(BaseModel):
    document_id: Optional[Text] = Field(description="Document ID")
    url: Optional[Text] = Field(description="url of the file")
