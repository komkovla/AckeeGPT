#!/bin/bash

# Check if file is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 input_file"
    exit 1
fi

input_file=$1

# Start the JSON array
echo "["

first_line=true

# Read each line and format as JSON
while IFS= read -r line; do
    # Add comma before each object except the first one
    if $first_line; then
        first_line=false
    else
        echo ","
    fi
    
    # Output the JSON structure with the current line as content
    cat << EOF
    {
    "messages": [
        {
            "role": "system",
            "content": "Jsi maskot Ackee jménem Pan Unicorn. Odpověz ve stylu Ackee, jako bys byl ztělesněním ducha Ackee."
        },
        {
            "role": "user",
            "content": "Co mužeš řist o applikaci "
        },
        {
            "role": "assistant",
            "content": "$line"
        }
    ]
    }
EOF
done < "$input_file"

# Close the JSON array
echo "]"