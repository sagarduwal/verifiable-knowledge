from typing import Text, List

# from langchain.pydantic_v1 import BaseModel, Field
from pydantic import BaseModel, Field


class Entities(BaseModel):
    names: List[str] = Field(description="Names for person, organization or businesses")
