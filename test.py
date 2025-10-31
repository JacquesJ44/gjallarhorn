import os
import dotenv
# Load .env variables   
dotenv.load_dotenv()

ROUTERS = os.getenv("DEVICES").split(",")

for i in ROUTERS:
    print(i)