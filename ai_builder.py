#!/usr/bin/env python3
"""
Agentic AI Builder for Sales War Room
Run: python3 ai_builder.py
"""

import os
import subprocess
import json
from pathlib import Path

# Configuration
PROJECT_NAME = "sales-war-room"
PROJECT_PATH = Path(f"/Users/manishgupta/Desktop/dholera-rm-app")

# Task definitions for the AI agent
TASKS = [
    {
        "name": "create_supabase_client",
        "description": "Create Supabase client configuration",
        "file": "src/supabaseClient.js",
        "content": """
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
"""
    },
    {
        "name": "create_env_file",
        "description": "Create environment variables file",
        "file": ".env",
        "content": """
REACT_APP_SUPABASE_URL=https://csstahxmifibozylwbrq.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_pDPbEContDtFB9g6b9NXu9Q_EqZBS...
CI=false
"""
    },
    {
        "name": "create_vercel_config",
        "description": "Create Vercel configuration",
        "file": "vercel.json",
        "content": """
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
"""
    }
]

def create_file(filepath, content):
    """Create a file with content"""
    full_path = PROJECT_PATH / filepath
    full_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content.strip())
    print(f"✅ Created: {filepath}")

def main():
    print("🤖 Agentic AI Builder - Sales War Room")
    print("=" * 50)
    print(f"📁 Project Path: {PROJECT_PATH}")
    print("")
    
    # Create project directory if not exists
    PROJECT_PATH.mkdir(parents=True, exist_ok=True)
    
    # Execute tasks
    for task in TASKS:
        print(f"📋 Executing: {task['name']}")
        print(f"   Description: {task['description']}")
        
        if 'file' in task:
            create_file(task['file'], task['content'])
        print("")
    
    print("=" * 50)
    print("🎉 Setup complete!")
    print("\n📝 Next steps:")
    print("  1. Update supabaseClient.js with your actual credentials")
    print("  2. Run 'npm start' to test")
    print("  3. Use Continue extension in VS Code for AI assistance")

if __name__ == "__main__":
    main()#!/usr/bin/env python3
# ... paste the entire Python code from Step 2 here ...
