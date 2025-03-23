#!/bin/bash

# Output file
OUTPUT_FILE="combined_markdown.md"

# Clear the output file if it exists
> "$OUTPUT_FILE"

# Add a title to the output file
echo "# Combined Markdown Files" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to process and append a file to the output
process_file() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo "" >> "$OUTPUT_FILE"
    echo "## From file: $filename" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Append the content of the file
    cat "$file" >> "$OUTPUT_FILE"
    
    # Add a separator
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
}

echo "Processing files from ackee-brand-book/_posts/ackee..."
# Process all .md and .mdx files in the ackee directory
for file in ackee-brand-book/_posts/ackee/*.md ackee-brand-book/_posts/ackee/*.mdx; do
    if [ -f "$file" ]; then
        echo "Adding $file"
        process_file "$file"
    fi
done

echo "Processing files from ackee-brand-book/_posts/komunikace..."
# Process all .md and .mdx files in the komunikace directory
for file in ackee-brand-book/_posts/komunikace/*.md ackee-brand-book/_posts/komunikace/*.mdx; do
    if [ -f "$file" ]; then
        echo "Adding $file"
        process_file "$file"
    fi
done

echo "All files have been concatenated to $OUTPUT_FILE" 