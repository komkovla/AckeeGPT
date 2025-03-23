import json
import sys

def convert_json_to_jsonl(input_file, output_file):
    # Read the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Write each object as a separate line in the JSONL file
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_json_to_jsonl.py input.json output.jsonl")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    convert_json_to_jsonl(input_file, output_file)
    print(f"Converted {input_file} to {output_file}")