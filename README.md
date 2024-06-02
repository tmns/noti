# noti

`noti` is an Electron tray app that provides you with an interface for managing your GitHub notifications and pull requests.

<details>
  <summary>Click for an example screenshot</summary>
  <img width="300" src="https://github.com/tmns/noti/blob/main/screenshots/ex-screenshot.jpg?raw=true" />
</details>

Currently it supports the following features:

- Receive GitHub notifications in near real time (uses polling, if building yourself you can of course change the interval).
- Directly open what the notification pertains to in GitHub (e.g. if the notification is a for a pull request, opens the pull request in your browser).
- Mark notifications as read (both on GitHub and locally).
- View your pull requests and directly open them in the browser.

It's built on top of the following tech:

- Electron
- SolidJS
- TailwindCSS
- Vite

_Note, this is mainly just a fun project for me to play around with SolidJS and Electron. Though I do use it on a daily basis, it basically only does exactly what I need it to do._

_Further, I've only tested it on mac (arm). If you have any suggestions or feature requests, please open an issue or pull request, but I can't promise anything!_

_If you're simply looking for a fully-featured notification manager I'd suggest you try something like [Neat](https://neat.run/), which inspired this project._

## Local Setup

If you just want to run the app, best bet is to first install all necessary packages:

```bash
$ yarn
```

And then build a prod version of the app for your environment (note I've only tested on mac [arm]):

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

If all is successful, you should see a `dist` folder in the root of the project. Inside you'll find a folder for each platform you built the app for.

### Authentication

For this app I chose to simply use GitHub authentication via their Personal Access Token (classic). This is because it's very straightforward and you don't need any extra permissions when dealing with enterprise repos. To create a classic Personal Access Token:

1. Navigate to https://github.com/settings/tokens
2. Click the "Generate new token" button
3. Click the "Generate new token (classic) option
4. Select "notifications" and "repo" scopes

Once you are presented with your token, you can copy and paste it into the app. You'll notice that you will also be asked to enter a password. The app uses this password to encrypt your token and store it on your local machine. Your password itself is not stored, and so you will be asked for it each time you open the app in order to decrypt your token.

### Development

To run the app in development mode with HMR:

```bash
$ yarn dev
```
