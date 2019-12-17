import json
import os
import sys
staging_argument = str(sys.argv[1])
image = ""

if staging_argument == "stage":
    image = os.environ['STAGE_FRONTEND_ECR']
    print("Environment is: {}".format(staging_argument))
    print("Docker image is: {}".format(image))
if staging_argument == "demo":
    image = os.environ['DEMO_FRONTEND_ECR']
    print("Environment is: {}".format(staging_argument))
    print("Docker image is: {}".format(image))
if staging_argument == "prod":
    image = os.environ['PROD_FRONTEND_ECR']
    print("Environment is: {}".format(staging_argument))
    print("Docker image is: {}".format(image))

with open('downloaded_definition.json', encoding='utf-8') as f:
    data = json.load(f)
    print("Setting Image and tag for frontend.. .")
    data['taskDefinition']['containerDefinitions'][0]['image'] = "{image}:{tag}".format(
        image=image, tag=os.environ['CI_BUILD_REF'])
    del data['taskDefinition']['taskDefinitionArn']
    del data['taskDefinition']['revision']
    del data['taskDefinition']['status']
    del data['taskDefinition']['requiresAttributes']
    del data['taskDefinition']['compatibilities']
    with open("new_task_definition.json", 'w') as new:
        new.write(json.dumps(data['taskDefinition'], indent=2, separators=(',', ': ')))
        print("Done!")
