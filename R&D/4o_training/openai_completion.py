#!/usr/bin/env python3

import os
import argparse
import json
import uuid
import openai
from openai import OpenAI

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description="Generate text using OpenAI's API")
    
    # Create a mutually exclusive group for prompt source
    prompt_group = parser.add_mutually_exclusive_group(required=True)
    prompt_group.add_argument("--user_prompt", help="The user prompt for the completion")
    prompt_group.add_argument("--user_file", help="File containing the user prompt")
    
    parser.add_argument("--system_file", default="system_prompt.txt", 
                        help="File containing the system prompt (default: system_prompt.txt)")
    args = parser.parse_args()
    
    # Get API key from environment
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        return 1
    
    # Read system prompt from file
    try:
        with open(args.system_file, 'r') as file:
            system_prompt = file.read().strip()
    except FileNotFoundError:
        print(f"Error: System prompt file {args.system_file} not found")
        return 1
    except Exception as e:
        print(f"Error reading system prompt file: {e}")
        return 1
    
    # Get user prompt from file or command line
    if args.user_file:
        try:
            with open(args.user_file, 'r') as file:
                user_prompt = file.read().strip()
        except FileNotFoundError:
            print(f"Error: User prompt file {args.user_file} not found")
            return 1
        except Exception as e:
            print(f"Error reading user prompt file: {e}")
            return 1
    else:
        user_prompt = args.user_prompt
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    
    try:
        # Make API call
        response = client.chat.completions.create(
            model="o3-mini-2025-01-31",
            # model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        # Print the response
        print(response)
        
        with open(f"./output/output_{uuid.uuid4()}.json", "a") as file:
            file.write(formatOutput(user_prompt, response.choices[0].message.content) + "\n")
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return 1
    
    return 0

# {
#     "messages": [
#         {
#             "role": "system",
#             "content": "Jsi maskot Ackee jménem Pan Unicorn. Odpověz ve stylu Ackee, jako bys byl ztělesněním ducha Ackee."
#         },
#         {
#             "role": "user",
#             "content": "<user_prompt>"
#         },
#         {
#             "role": "assistant",
#             "content": "<assistant_prompt>"
#         }
#     ]
#     }
def formatOutput(user_prompt: str, assistant_prompt: str) -> str:
    output = {
        "messages": [
            {
                "role": "system",
                "content": "Jsi maskot Ackee jménem Pan Unicorn. Odpověz ve stylu Ackee, jako bys byl ztělesněním ducha Ackee."
            },
            {
                "role": "user", 
                "content": user_prompt
            },
            {
                "role": "assistant",
                "content": assistant_prompt
            }
        ]
    }
    return json.dumps(output, ensure_ascii=False)

if __name__ == "__main__":
    exit(main())