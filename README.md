# Temporal-App: Use Case Demonstration of Temporal.io
This project demonstrates simple use cases of the popular workflow orchestration tool, Temporal.io. The project currently showcases three use cases, accessible through dedicated API endpoints. Below are the details of each use case:

###  Use Case One

**Workflow Identifier**: A unique workflow ID is created, prefixed with workflow-one- and suffixed with a UUID.

**Task Queue**: The workflow is assigned to the task queue "use-case-one-task-queue", and a worker listens specifically to this queue.

**Namespace**: The workflow is executed under the "default" namespace.

**Activity Execution**: A non-deterministic activity function is executed, with exception handling and retries configured.
The workflow is kept simple for easy understanding, beginning with some console outputs and ending by returning the result of an activity function call.

**Endpoint**: `POST /usecase-1`

**Example**:
```bash
curl -X POST http://localhost:3001/orders/usecase-1
```


### Use Case Two
This use case follows a setup similar to the first use case. It starts a parent workflow, which in turn starts a child workflow. The cancellation policy is configured so that upon cancellation of the parent workflow, the child workflow is also gracefully cancelled.

**Start Workflow**: Initiates the parent and child workflow.
**Cancellation**: An API endpoint is exposed to cancel the workflow by providing the workflow ID.
**Signaling**: Another endpoint is available to signal a running workflow by providing the workflow ID and the correct signal name.

**Endpoints**:


`POST /usecase-2`: Start the parent and child workflow.

```bash
curl -X POST http://localhost:3001/orders/usecase-2
```

`POST /usecase-2-util-1`: Cancel the running workflow by providing the workflow ID.

```bash
curl -X POST http://localhost:3001/orders/usecase-2-util-1 \
-H "Content-Type: application/json" \
-d '{"workflowId": "workflow-one-<UUID>"}'
```

`POST /usecase-2-util-2`: Signal the workflow by providing the workflow ID.

```bash
curl -X POST http://localhost:3001/orders/usecase-2-util-2 \
-H "Content-Type: application/json" \
-d '{"workflowId": "workflow-one-<UUID>"}'
```


### Use Case Three
This use case demonstrates signaling both the parent and child workflows. There are two endpoints exposed:

**Start Workflow**: Begins the parent workflow and optionally a child workflow.
**Signal Workflow**: Sends signals to active workflows. The payload must contain the correct workflow IDs and signal names.

**Endpoints**:


`POST /usecase-3`: Start the parent and child workflow.

```bash
curl -X POST http://localhost:3001/orders/usecase-3
```

`POST /usecase-3-util-1`: Signal the parent or child workflows by providing the workflow ID and signal names.
```bash
curl -X POST http://localhost:3001/orders/usecase-3-util-1 \
-H "Content-Type: application/json" \
-d '{
      "parentWorkflowId": "workflow-parent-<UUID>",
      "childWorkflowId": "workflow-child-<UUID>",
      "parentSignalName": "cancelParentWorkflow",
      "childSignalName": "cancelChildWorkflow"
    }'
```
### How It Works:
 - The parent workflow and child workflow can be signaled independently or together, as long as the correct workflow IDs and signal names are provided in the payload.
 - This setup demonstrates how to use Temporal signals to communicate between workflows and trigger specific activity functions based on those signals.

## Prerequisites

Before running this project, ensure you have the following:

- **Node.js**: Ensure Node.js is installed on your machine. [Download Node.js](https://nodejs.org/en/download/).
- **Temporal Server**: You will need a running Temporal server. You can set it up using Docker by following the [Temporal Quick Install Guide](https://learn.temporal.io/getting_started/typescript/dev_environment/).

## Running Locally

1. **Clone the repository**:
   ```bash
   git@github.com:para-commando/temporal-app.git
   cd temporal-app
   ```

2. **Open two terminal windows**:

   - In the first terminal, start the Temporal server:
     ```bash
     npm run start:temporal:dev
     ```

   - In the second terminal, start the application:
     ```bash
     npm run start:dev
     ```

Now, you're all set to run the Temporal app locally and explore the use cases!


## Conclusion

This project serves as a basic demonstration of Temporal's powerful workflow orchestration capabilities. By exploring the three use cases, you can gain insight into how Temporal handles workflow execution, child workflows, cancellation policies, and signals between workflows.

Temporal's ability to manage complex workflows and ensure reliability through its robust features such as activity retries, cancellation handling, and signal-based communication makes it a go-to tool for distributed systems.

Feel free to explore the code, modify the use cases, and experiment with more advanced Temporal features such as timers, queries, and long-running workflows. Contributions and feedback are welcome to help expand this project further!

## Next Steps:
- Learn more about Temporal by visiting [Temporal.io](https://temporal.io/).
- Explore the [Temporal documentation](https://docs.temporal.io/) for deeper insights and advanced use cases.
- Fork this repository and add your own use cases or enhancements!

