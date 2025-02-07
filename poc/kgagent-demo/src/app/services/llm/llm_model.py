from config import Config
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

_config = Config()
print(_config.get_config())
llm_config = _config.get_config_key("LLM")


class LLMClient:
    def __init__(self, model, temperature, api_key: str) -> None:
        self.model = model
        self.temperature = temperature
        self.api_key = api_key

    def generate(
        self, prompt_template: ChatPromptTemplate, query: dict, output_schema=None
    ) -> str:
        runner = None
        if output_schema:
            runner = prompt_template | ChatOpenAI(
                api_key=self.api_key, model=self.model, temperature=self.temperature
            ).with_structured_output(schema=output_schema)
        else:
            runner = prompt_template | ChatOpenAI(
                api_key=self.api_key, model=self.model, temperature=self.temperature
            )
        output = runner.invoke(query)
        return output
