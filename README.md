> This product has been put on indefinite hold for legal reasons. See below
<h1 align="center">🎵 Streamchu 🌎</h1>
<p align="center">Stream copyrighted video / audio over Twitch streams without copyright infringement</p>

<p align="center">
  <a style="padding: 0 10px;" href="#what-is-it">What is it</a> •
  <a style="padding: 0 10px;" href="#installation">Installation</a> •
  <a style="padding: 0 10px;" href="#getting-started">Getting Started</a> •
  <a style="padding: 0 10px;" href="#legal">Legal</a>
</p>

<p align="center"><h4 align="left">What is it</h4>
<p> Streamchu is the in-house development name for a product that would have allowed Twitch streamers to stream copyrighted content such as music or videos in their Twitch streams over a Twitch extension without having to worry about infringing on an artist's rights.<br>
With our product we were hoping to bring an end to the reoccurring and persistent problem of copyright-infringement on Twitch with a win-win situation. One where the streamers could still enjoy content with their viewers and where the creators of such content would still be compensated for their hard work.</p>
<p> This would have worked by "capturing" whatever it is that the streamer was currently playing on eg. Spotify, YouTube, Apple Music etc. and transmit a resource locator over our extension backend to every connected client (Twitch extension) to have the selected title play over the viewers own, private, payed for (Spotify Premium, YT Ads, etc.) connection, thus effectively paying the artist the appropriate amount based on viewership.</p>
<p> The code in this repository is a mostly production ready (with exception of stream.js) Node.js backend that can be repurposed to function as a performant way to login users to your service, manage large clusters of Amazon EC2 / VPS instances and ensure secure communication between host and instances. The stream.js script uses the by far most performant WebSockets library available and can be repurposed as a general purpose pub-sub server or JSON API that can handle up to [1 MILLION concurrent clients.](https://medium.com/@alexhultman/millions-of-active-websockets-with-node-js-7dc575746a01)</p>

<p align="center"><h4 align="left">Installation</h4>
<p>Installation is as following:<br><br>
1. Clone repository<br>
2. Copy main_server to the instance you wish to use as the controller for your instances<br>
3. Copy server_instance to every EC2 / VPS instance<br>
4. Install a MySQL server on the controller, see documentation.md for setup<br>
5. Run hive_controller.js on the controller and login.js if you wish to use it<br>
6. Run instance_master.js on the instances. The project was abandoned before this process could be automated <br>
7. Enjoy
</p>

<p align="center"><h4 align="left">Getting Started</h4>
<p> The hive_controller will respond to commands, type anything to see the available options. It is recommended to use a product such as StrongLoop Process Manager to ensure your application automatically restarts. Furthermore remember that this project was abandoned before launch, so even though for the existing parts of the codebase plenty of testing has been conducted I cannot assure you that no bugs / vulnerabilities exist in the codebase. Always check for yourself.</p>

<p align="center"><h4 align="left">Legal</h4>
<p> After consulting our lawyer this project had to be abandoned as we were unaware that, even though the playing of the copyrighted work is legal, one furthermore requires a so called sync-license if the copyrighted work is accompanied by a visual aid such as a Twitch stream. The negotiation of a sync-license for every song or other work in existence would be prohibitively expensive for us so the project was put on ice.<br>

Whilst we later realized an alternative to our product exists (Amazon Music) the service seems to have failed what we were trying to achieve, probably due to the fact that it required everyone to have a premium subscription to a service with a relatively low market share, and did not allow for the "translation of service" (Streamer plays on Spotify, viewer listens to on Deezer) that we were going for. This created a barrier of entry to streamers hoping to utilize their product in their streams as it would have alienated a significant part of their viewership.
