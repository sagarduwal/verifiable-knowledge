# Use the official Python image from the Docker Hub
FROM python:3.11.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install poetry
RUN poetry install

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variables
ENV VDB_URL=http://0.0.0.0:6333
ENV GDB_URL=bolt://localhost:7687
ENV GDB_USERNAME=neo4j
ENV GDB_PASSWORD=60beZCZ7C17L

# Run the application
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
