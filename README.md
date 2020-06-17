We need the {sourceMap : true} in tsconfig.json for debugging locally
When deploying to prod, we want to set {sourceMap : false}

To link to a AWS account:

npm i -g serverless

Go to IAM and create a new user that has Admin permissions(this is the user serverless will use to create resources) Once the setup is done, copy the KEY and SECRET and run the command:

serverless config credentials --provider aws --key {KEY} --secret {SECRET} --profile serverlessUser

The serverlesUser profile is linked in the serverless.yml file, so if you change the profile name, make sure to update the serverless.yml file as well.