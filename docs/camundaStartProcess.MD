# /camunda/startProcess/{process}

Start a process. Usually slack adresses the endpoint after a user used a slash command.


## Variables to pass

**Mind:** The elements with the same index in several arrays belongs to each other!

| variable name  | type | description |
| ------------- | ------------- | ------------- | 
| `token` | string  | token |
| `command` | string | the used command |
| `text` | string  | additional text added after the command by the user |
| `team_id` | string | workspace id |
| `team_domain` | string | workspace domain |
| `channel_id` | string | slack channel id |
| `channel_name` | string | slack channel name |
| `user_id` | string | slack user id |
| `user_name` | string | slack user name |
| `trigger_id` | string | trigger id of the slash command |

Pass the parameters inside the path. 
