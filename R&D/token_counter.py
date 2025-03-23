#!/usr/bin/env python3
import sys
import tiktoken
import argparse

def count_tokens(filename, encoding_name="o200k_base"):
    """Count the number of tokens in a text file using the specified encoding.
    
    Args:
        filename: Path to the file to analyze
        encoding_name: The tiktoken encoding to use (default: o200k_base for GPT-4/3.5)
    
    Returns:
        int: Number of tokens
    """
    try:
        # Get the encoding
        encoding = tiktoken.get_encoding(encoding_name)
        
        # Read file content
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count tokens
        tokens = encoding.encode(content)
        return len(tokens)
    
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found")
        return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Count tokens in a text file')
    parser.add_argument('filename', help='Path to the file to analyze')
    parser.add_argument('--encoding', '-e', default='o200k_base', 
                        help='Tiktoken encoding to use (default: o200k_base)')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Count tokens
    token_count = count_tokens(args.filename, args.encoding)
    
    # Print results
    if token_count is not None:
        print(f"File: {args.filename}")
        print(f"Encoding: {args.encoding}")
        print(f"Token count: {token_count}")

if __name__ == "__main__":
    main() 