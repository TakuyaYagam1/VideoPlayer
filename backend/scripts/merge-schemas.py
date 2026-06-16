#!/usr/bin/env python3
"""Merge split OpenAPI schema files into components/schemas.yml."""

import re
import sys
from pathlib import Path

try:
    import yaml
except ModuleNotFoundError:
    print(
        "Missing PyYAML. Install codegen dependencies with: "
        "python3 -m pip install -r scripts/requirements-codegen.txt"
    )
    sys.exit(1)


SCHEMAS_DIR = Path("internal/openapi/components/schemas")
SCHEMAS_FILE = Path("internal/openapi/components/schemas.yml")
ROUTES_DIR = Path("internal/openapi/routes")
PREFIXES = ("response.", "request.", "v1.", "jwt.", "entity.")


def normalize_schema_name(name):
    for prefix in PREFIXES:
        if name.startswith(prefix):
            return name[len(prefix) :]
    return name


def convert_refs(obj, name_mapping):
    if isinstance(obj, dict):
        result = {}
        for key, value in obj.items():
            if key == "$ref" and isinstance(value, str):
                result[key] = convert_ref(value, name_mapping)
                continue

            result[key] = convert_refs(value, name_mapping)
        return result

    if isinstance(obj, list):
        return [convert_refs(item, name_mapping) for item in obj]

    return obj


def convert_ref(value, name_mapping):
    if value.startswith("#/schemas/"):
        old_name = value.replace("#/schemas/", "")
        return f"#/{name_mapping.get(old_name, normalize_schema_name(old_name))}"

    marker = "../components/schemas.yml#/schemas/"
    if marker in value:
        old_name = value.split("#/schemas/")[-1]
        return f"../components/schemas.yml#/{name_mapping.get(old_name, normalize_schema_name(old_name))}"

    return value


def load_schemas():
    all_schemas = {}
    name_mapping = {}

    for schema_file in sorted(SCHEMAS_DIR.glob("*_schemas.yml")):
        with schema_file.open("r", encoding="utf-8") as file:
            content = yaml.safe_load(file)

        if not content or not content.get("schemas"):
            continue

        for old_name, schema_def in content["schemas"].items():
            new_name = normalize_schema_name(old_name)
            if new_name in all_schemas:
                print(
                    f"Warning: duplicate normalized schema name '{new_name}' from '{old_name}'"
                )
            name_mapping[old_name] = new_name
            all_schemas[new_name] = schema_def

    return all_schemas, name_mapping


def write_schemas(schemas, name_mapping):
    SCHEMAS_FILE.parent.mkdir(parents=True, exist_ok=True)

    converted = {
        name: convert_refs(schema_def, name_mapping)
        for name, schema_def in schemas.items()
    }

    with SCHEMAS_FILE.open("w", encoding="utf-8") as file:
        yaml.dump(
            converted,
            file,
            default_flow_style=False,
            sort_keys=False,
            allow_unicode=True,
            width=1000,
        )

    print(f"Merged {len(converted)} schemas into {SCHEMAS_FILE}")


def stale_refs_in_file(file_path):
    with file_path.open("r", encoding="utf-8") as file:
        content = file.read()

    pattern = r"('../components/schemas\.yml#/schemas/)([^']+)'"

    return [
        (
            match.group(0),
            f"'../components/schemas.yml#/{normalize_schema_name(match.group(2))}'",
        )
        for match in re.finditer(pattern, content)
    ]


def validate_route_refs():
    stale_refs = []

    for route_file in ROUTES_DIR.glob("*.yml"):
        for old_ref, new_ref in stale_refs_in_file(route_file):
            stale_refs.append((route_file, old_ref, new_ref))

    if stale_refs:
        print("Stale route refs found. Update handwritten route files explicitly:")
        for route_file, old_ref, new_ref in stale_refs:
            print(f"  {route_file}: {old_ref} -> {new_ref}")
        sys.exit(1)

    print("Route files already up to date")


def main():
    schemas, name_mapping = load_schemas()
    write_schemas(schemas, name_mapping)
    validate_route_refs()


if __name__ == "__main__":
    main()
