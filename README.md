# 🪝 GitHub Webhook Script Runner

> Run a shell script when you push to a repository - a mini, self-hosted CI/CD 💚

Quickly start up a server that listens to [webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks) requests, and run a [shell script](./script.sh) when you push to your repository on GitHub.

This is most useful when your project is running on a personal VPS (EC2, Droplets, etc.) and you want to relieve yourself of `git pull`ing and `npm run build`ing every time.

## Setup

1. Clone this repo or use the template to create a new repo
2. Setup environment variables: `cp .env.example .env`:

   `PORT`: The port at which this server will run<br>
   `WEBHOOK_SECRET`: Secret key to encrypt and validate webhook requests. It can be anything, make sure it's secure.<br>
   `REPO_PATH`: Path (to the repository) where you want to run the script

3. Install dependencies and start the server:

   ```bash
   npm install
   npm start
   ```

   The server is now listening on `${PORT}`.

4. Configure a (sub)domain for this server. Can easily be achieved by using something like Nginx to reverse proxy requests to this server. Let's assume our domain is `hooks.example.com`.

5. Setup the repository's webhook on GitHub:

   - Go to settings/webhooks in the repository
   - Create a new webhook with:
     - Domain: `https://hooks.example.com`
     - Webhook secret: `WEBHOOK_SECRET` in the `.env` file
     - Content type: `application/json`
     - `push` type event

6. 🎉 It should be setup now and running! You can view the "Recent deliveries" of the webhook inside the webhook settings on GitHub to check whether you have received a 200 response with `Script started.`. Debug on your own :P.

### Example script

An example script for a basic Node webapp would be:

```bash
cd $1                   # cd into the repo's directory
git stash               # stash any changes
git pull origin master  # pull the latest commits
npm install             # install new packages, if any
npm run build           # build production bundles
npm run start           # start the server
```

## License

[MIT](LICENSE)
