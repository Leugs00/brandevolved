# agency/ — Agency Services Tier

Client-facing service delivery: projects, deliverables, and reusable templates.

## Subdirectories

| Path          | Contents                                              |
|---------------|-------------------------------------------------------|
| `clients/`    | One subfolder per client (`clients/<client-slug>/`)   |
| `projects/`   | Active project workspaces                             |
| `templates/`  | Reusable deliverable templates                        |

## Client Folder Convention

```
clients/
└── acme-corp/
    ├── brief.md
    ├── deliverables/
    └── notes/
```

Keep client data inside their own folder. Do not cross-reference client files.
