import os

from dotenv import find_dotenv, load_dotenv


class Config:
    def __init__(self) -> None:
        load_dotenv(find_dotenv())

    def get_config(self):
        try:
            return {
                "LLM": {
                    "PROVIDER": "openai",
                    "MODEL_NAME": "gpt-4o-mini",
                    "TEMPERATURE": 0.5,
                    "API_KEY": os.environ["OPENAI_API_KEY"],
                },
                "VDB": os.environ["VDB_URL"],  # vector database
                "GDB": {
                    "USERNAME": os.environ["GDB_USERNAME"],
                    "PASSWORD": os.environ["GDB_PASSWORD"],
                    "URL": os.environ["GDB_URL"],
                },  # graph database
            }
        except Exception as e:
            print(str(e))
            return e

    def get_config_key(self, key: str):
        print(self.get_config())
        return self.get_config()[key]
