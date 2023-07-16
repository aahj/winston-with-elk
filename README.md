# Winston Logging with Elastic Search, Logstash, Kibana (ELK)

## Prerequesite

Run the latest version of the [Elastic stack][elk-stack] with Docker and Docker Compose.

It gives you the ability to analyze any data set by using the searching/aggregation capabilities of Elasticsearch and
the visualization power of Kibana.

## Requirements

### Host setup

* [Docker Engine][docker-install] version **18.06.0** or newer
* [Docker Compose][compose-install] version **1.28.0** or newer (including [Compose V2][compose-v2])
* 1.5 GB of RAM

> **Note**  
> Especially on Linux, make sure your user has the [required permissions][linux-postinstall] to interact with the Docker
> daemon.

By default, the stack exposes the following ports:

* 5044: Logstash Beats input
* 50000: Logstash TCP input
* 9600: Logstash monitoring API
* 9200: Elasticsearch HTTP
* 9300: Elasticsearch TCP transport
* 5601: Kibana

## Usage
### Bringing up the stack

Clone this repository onto the Docker host that will run the stack with the command below:

```sh
git clone https://github.com/deviantony/docker-elk.git
```

Then, initialize the Elasticsearch users and groups required by docker-elk by executing the command:

```sh
docker-compose up setup
```

If everything went well and the setup completed without error, start the other stack components:

```sh
docker-compose up -d
```

Give Kibana about a minute to initialize, then access the Kibana web UI by opening <http://localhost:5601> in a web
browser and use the following (default) credentials to log in:

* user: *elastic*
* password: *changeme*

> **Note**  
> Upon the initial startup, the `elastic`, `logstash_internal` and `kibana_system` Elasticsearch users are intialized
> with the values of the passwords defined in the [`.env`](.env) file (_"changeme"_ by default). The first one is the
> [built-in superuser][builtin-users], the other two are used by Kibana and Logstash respectively to communicate with
> Elasticsearch. This task is only performed during the _initial_ startup of the stack. To change users' passwords
> _after_ they have been initialized, please refer to the instructions in the next section.

### Initial setup

#### Setting up user authentication


> **Warning**  
> Starting with Elastic v8.0.0, it is no longer possible to run Kibana using the bootstraped privileged `elastic` user.

The _"changeme"_ password set by default for all aforementioned users is **unsecure**. For increased security, we will
reset the passwords of all aforementioned Elasticsearch users to random secrets.

1. Reset passwords for default users

    The commands below reset the passwords of the `elastic`, `logstash_internal` and `kibana_system` users. Take note
    of them.

    ```sh
    docker-compose exec elasticsearch bin/elasticsearch-reset-password --batch --user elastic
    ```

    ```sh
    docker-compose exec elasticsearch bin/elasticsearch-reset-password --batch --user logstash_internal
    ```

    ```sh
    docker-compose exec elasticsearch bin/elasticsearch-reset-password --batch --user kibana_system
    ```

    If the need for it arises (e.g. if you want to [collect monitoring information][ls-monitoring] through Beats and
    other components), feel free to repeat this operation at any time for the rest of the [built-in
    users][builtin-users].

1. Replace usernames and passwords in configuration files

    Replace the password of the `elastic` user inside the `.env` file with the password generated in the previous step.
    Its value isn't used by any core component, but [extensions](#how-to-enable-the-provided-extensions) use it to
    connect to Elasticsearch.

    > **Note**  
    > In case you don't plan on using any of the provided [extensions](#how-to-enable-the-provided-extensions), or
    > prefer to create your own roles and users to authenticate these services, it is safe to remove the
    > `ELASTIC_PASSWORD` entry from the `.env` file altogether after the stack has been initialized.

    Replace the password of the `logstash_internal` user inside the `.env` file with the password generated in the
    previous step. Its value is referenced inside the Logstash pipeline file (`logstash/pipeline/logstash.conf`).

    Replace the password of the `kibana_system` user inside the `.env` file with the password generated in the previous
    step. Its value is referenced inside the Kibana configuration file (`kibana/config/kibana.yml`).

    See the [Configuration](#configuration) section below for more information about these configuration files.

1. Restart Logstash and Kibana to re-connect to Elasticsearch using the new passwords

    ```sh
    docker-compose up -d logstash kibana
    ```

> **Note**  
> Learn more about the security of the Elastic stack at [Secure the Elastic Stack][sec-cluster].

#### Injecting data

Launch the Kibana web UI by opening <http://localhost:5601> in a web browser, and use the following credentials to log
in:

* user: *elastic*
* password: *\<your generated elastic password>*

Now that the stack is fully configured,

# Steps to run the node project
Navigate to the directory where you cloned the *winston-with-elk* and follow the steps below:

## Requirements

- node v18.16.1
- npm v9.5.1


### install node_modules
```sh
npm i
```
Replace the ELASTIC_USER and ELASTIC_PASSWORD in env file with yours

### start server
```sh
npm run start
```

After server is being started, hit the auth api. Now, your logs has been generated. You may see your logs in Kibana. First of all prior to viewing your logs through Kibana, you need to create an Index Pattern. Follow the below steps to create an index pattern.
- click the Stack Management tab in the Kibana
- goto Data Views tab
- create Data View [image](https://github.com/aahj/winston-with-elk/blob/master/kibana-step01.png)
- give name to your *data view*
- once you start entering the index pattern it would automatically recognize the the indexes available under the given index-name as follows: search your index pattern as *auth-logging* *
- add a filter as timestamp and click create index pattern
- Now that you have successfully created an Index Pattern you can go to the “Discover” tab in Kibana and view the logs.

## References
- [Elastic stack (ELK) on Docker](https://github.com/deviantony/docker-elk)