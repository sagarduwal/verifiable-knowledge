# ethglobal-hackathon

Verifiable knowledge onchain

- purchase-able knowledge data
- fetch data from documents or social media to generate knowledge graph
- store data and knowledge to blockchain
- lit protocol to encrypt and decrypt with shareable access
- https://docs.origintrail.io/dkg-v6-previous-version/dkgintro
- https://x.com/ClusterProtocol/status/1882896033988096286
- data could be used for chat interface by anyone - interact onchain and on/off-line
- RAG + Deepseek + Defi + ~~walrus~~ + elizaos

- basic prototype of decentralized private knowledge graph with altlayer's autonome and agentkit

Docker images
$ docker run --publish=7474:7474 --publish=7687:7687 --volume=$HOME/neo4j/data:/data --env='NEO4JLABS_PLUGINS=["apoc"]' neo4j

Sample files:
https://data-lake-demo-23.s3.us-east-2.amazonaws.com/altlayer.txt
https://data-lake-demo-23.s3.us-east-2.amazonaws.com/ethglobal.txt
https://data-lake-demo-23.s3.us-east-2.amazonaws.com/example.txt
https://data-lake-demo-23.s3.us-east-2.amazonaws.com/lit-protocol.txt

Cypher export:

```
CALL apoc.export.cypher.all(null, {format: "create", stream: true}) YIELD cypherStatements
RETURN cypherStatements
```

```
CALL apoc.export.cypher.query(
  "MATCH (n)
   WHERE 'abc2' IN n.document_id
   OPTIONAL MATCH (n)-[r]-(m)
   WHERE m IS NULL OR 'abc' IN m.document_id
   RETURN n, r, m",
  null,
  {format: 'create', stream: true}
) YIELD cypherStatements
RETURN cypherStatements
```

TODO:

- very simple UI for KG, with login as
- for the generated KG, encrypt with the wallet for the user with lit protocol
-
