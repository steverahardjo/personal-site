---
title: 'Real-Time IoT Data Processing with Kafka and PySpark'
description: 'Building a pub/sub system for ingesting and processing real-time IoT sensor streams.'
pubDate: 2025-11-20
tags: ['PySpark', 'Kafka', 'MongoDB', 'Data Engineering']
---

# Real-Time IoT Data Processing with Kafka and PySpark

This article covers building a pub/sub system for ingesting and processing real-time IoT sensor streams using Kafka, PySpark, and MongoDB.

## Overview

IoT systems generate massive amounts of data that need to be processed in real-time. This project implements a complete data pipeline from sensor ingestion to visualization.

## Architecture

```
IoT Sensors → Kafka → PySpark → MongoDB → Visualization
```

### Components

1. **IoT Sensors:** Multiple data sources publishing sensor readings
2. **Kafka:** Message broker for pub/sub streaming
3. **PySpark:** Stream processing with custom UDFs
4. **MongoDB:** Data warehouse with change streams
5. **Matplotlib:** Dynamic visualizations

## Kafka Setup

### Topic Design

```python
from kafka.admin import KafkaAdminClient, NewTopic

admin_client = KafkaAdminClient(
    bootstrap_servers='localhost:9092',
    client_id='iot-pipeline'
)

topics = [
    NewTopic(
        name='sensor-raw',
        num_partitions=3,
        replication_factor=1
    ),
    NewTopic(
        name='sensor-processed',
        num_partitions=3,
        replication_factor=1
    )
]

admin_client.create_topics(new_topics=topics)
```

### Producer (Sensor Simulator)

```python
from kafka import KafkaProducer
import json
import random
from datetime import datetime

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def simulate_sensor_data():
    return {
        'sensor_id': f'sensor_{random.randint(1, 10)}',
        'timestamp': datetime.now().isoformat(),
        'temperature': round(random.uniform(20, 40), 2),
        'humidity': round(random.uniform(30, 80), 2),
        'pressure': round(random.uniform(980, 1020), 2)
    }

# Publish to Kafka
for _ in range(100):
    data = simulate_sensor_data()
    producer.send('sensor-raw', value=data)
```

## PySpark Stream Processing

### Streaming Setup

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

spark = SparkSession.builder \
    .appName('IoTStreamProcessing') \
    .config('spark.sql.streaming.checkpointLocation', '/tmp/checkpoints') \
    .getOrCreate()

# Read from Kafka
df = spark \
    .readStream \
    .format('kafka') \
    .option('kafka.bootstrap.servers', 'localhost:9092') \
    .option('subscribe', 'sensor-raw') \
    .option('startingOffsets', 'latest') \
    .load()

# Parse JSON
schema = StructType([
    StructType('sensor_id', StringType()),
    StructType('timestamp', TimestampType()),
    StructType('temperature', DoubleType()),
    StructType('humidity', DoubleType()),
    StructType('pressure', DoubleType())
])

parsed_df = df.selectExpr("CAST(value AS STRING)") \
    .select(from_json(col('value'), schema).alias('data')) \
    .select('data.*')
```

### Custom UDF for Anomaly Detection

```python
from pyspark.sql.functions import udf

def detect_anomaly(temp, humidity, pressure):
    """Detect anomalies using statistical thresholds."""
    anomalies = []
    
    if temp < 15 or temp > 45:
        anomalies.append('temperature')
    if humidity < 20 or humidity > 90:
        anomalies.append('humidity')
    if pressure < 970 or pressure > 1030:
        anomalies.append('pressure')
    
    return anomalies if anomalies else ['normal']

anomaly_udf = udf(detect_anomaly, ArrayType(StringType()))

# Apply UDF
processed_df = parsed_df \
    .withColumn('anomalies', anomaly_udf(
        col('temperature'),
        col('humidity'),
        col('pressure')
    )) \
    .withColumn('is_anomaly', 
                when(size(col('anomalies')) > 1, True).otherwise(False))
```

### Window Functions for Aggregation

```python
from pyspark.sql.window import Window

# Define window specification
window_spec = Window \
    .partitionBy('sensor_id') \
    .orderBy('timestamp') \
    .rowsBetween(-5, 0)  # Last 5 readings

# Calculate rolling statistics
aggregated_df = processed_df \
    .withColumn('avg_temp', avg('temperature').over(window_spec)) \
    .withColumn('std_temp', stddev('temperature').over(window_spec)) \
    .withColumn('rolling_max', max('temperature').over(window_spec))
```

### Write to MongoDB

```python
# Write stream to MongoDB
query = processed_df \
    .writeStream \
    .outputMode('append') \
    .format('mongo') \
    .option('uri', 'mongodb://localhost:27017') \
    .option('database', 'iot_warehouse') \
    .option('collection', 'sensor_data') \
    .option('checkpointLocation', '/tmp/checkpoints/mongo') \
    .start()

query.awaitTermination()
```

## MongoDB Change Streams

Trigger visualizations when new data arrives:

```python
from pymongo import MongoClient
import matplotlib.pyplot as plt

client = MongoClient('mongodb://localhost:27017/')
db = client['iot_warehouse']
collection = db['sensor_data']

# Watch for changes
with collection.watch() as stream:
    for change in stream:
        if change['operationType'] == 'insert':
            data = change['fullDocument']
            update_visualization(data)

def update_visualization(data):
    # Update Matplotlib visualization
    plt.scatter(data['timestamp'], data['temperature'])
    plt.pause(0.1)
```

## Key Learnings

### Kafka Topic Design
- Partition by sensor ID for parallel processing
- Use separate topics for raw and processed data
- Configure appropriate retention policies

### PySpark Optimization
- Use appropriate checkpoint locations
- Tune batch intervals for latency vs throughput
- Leverage window functions for time-series analysis

### MongoDB Schema Design
- Store time-series data efficiently
- Use indexes on timestamp and sensor_id
- Implement TTL indexes for automatic cleanup

## Conclusion

This pipeline demonstrates a complete real-time IoT data processing system using industry-standard tools. The combination of Kafka for streaming, PySpark for processing, and MongoDB for storage provides a scalable architecture for IoT applications.
