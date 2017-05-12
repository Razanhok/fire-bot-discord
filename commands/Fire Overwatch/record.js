exports.run = async (client, msg) => {
  const arg = msg.content.substring(msg.content.indexOf(' ') + 1).toLowerCase()
  switch (arg) {
    case 'nvidia':
    case 'shadowplay':
    case 'pc-nvidia':
      msg.author.sendEmbed({
        title: 'How to record and upload your gameplay with Shadowplay (NVIDIA GPU only)',
        description: 'Skip to step 2 if you already know that you have an NVIDIA GeForce GTX 600 or newer\nSkip to step 4 if you already have the GeForce Experience installed',
        color: 0x84BD00,
        fields: [
          {
            name: '1. Check if your graphics card is compatible',
            value: `Shadowplay supports GTX600 and newer GPUs. To find out which graphics card you actually have follow the steps below:\n\n**1.1** Go to settings > devices > Device Manager. A list will show up with all your connected devices.\n\n**1.2** Click the little arrow  next to DISPLAY DRIVERS and your graphics card will show up. If it's a GTX600 or newer, congratulations! You are able to use Shadowplay!\n\nIf your gpu is not compatible you can find instructions on how to record without Shadowplay with \`${client.config.prefix}record PC\``
          },
          {
            name: '2. Install GeForce Experience',
            value: 'Now head to [the GeForce experience download page](http://www.geforce.com/geforce-experience). Download and install the GeForce Experience where you will find shadowplay.'
          },
          {
            name: '3. Set up GeForce Experience',
            value: "Open up GeForce Experience. It will ask you to set up an account before you can proceed. After registration you will find the main 'hub' for your games."
          },
          {
            name: '4. Set up the recording',
            value: "Click on the little share icon ([image](http://i.imgur.com/xQaOPSs.png)) near the top right corner. An overlay will open up where you will can customise your settings for recordings. You will see the big icon in the middle is called 'Record'. Click on that and hit customize. By default shadowplay uses a higher bit rate than we will actually need for youtube, thus giving you a much larger upload time. I recommend you to use the following settings:\n\nResolution: 1080p (720p if you have REALLY slow internet)\nFramerate: up to you (60 gives you larger files and longer uploads)\nBit rate: 12 Mbps for 1080p 60fps, 8 Mbps for 30fps, 5 Mbps for 720p30 if you have very slow internet\n\nThis will help you with getting smaller file sizes (which uploads faster) without sacrificing any noticable amount of video quality."
          },
          {
            name: '5. Recording a game',
            value: 'Hop into a game and press `ALT+F9` on your keyboard to start recording, after you are done with your match press `ALT+F9` again to stop recording.'
          },
          {
            name: '6. Finding your file',
            value: "Your file is ready to be uploaded to youtube. To know where it was saved, open the overlay again, click on the settings icon, and click on recordings. It will be in the 'videos' folder."
          },
          {
            name: '7. Upload to youtube',
            value: "Go to [the youtube upload page](https://www.youtube.com/upload) and log in or sign up. You can change the privacy to unlisted so only those who have the link can access the video. Now choose your file and upload it. Once it's done you will have the link to paste in <#293163465441280000>"
          }
        ],
        footer: {
          icon_url: 'https://cdn.discordapp.com/icons/293161643674828800/cc1679307fd21c6d554fc56a3f598b78.jpg',
          text: 'If you have any questions feel free to ask! Thank you QuiTT for the guide <3'
        }
      }).then(() => {
        if (msg.channel.type === 'text') msg.reply('Instructions have been sent to your DMs.')
      })
      break
    case 'obs':
    case 'pc-obs':
      msg.author.sendEmbed({
        title: 'How to record and upload your gameplay with OBS',
        description: `OBS works on any PC powerfull enough to record while playing. If you have an NVIDIA graphics card you might want to consider recording your gameplay with Shadowplay as it uses less resources (${msg.guildConf.prefix}record shadowplay).`,
        color: 0x1F1F1F,
        fields: [
          {
            name: '1. Download and install OBS',
            value: 'Go to the [OBS website](https://obsproject.com/download) and click download. Now just install it, should be straight forward, if there’s any errors then google what the error is saying and look for a solution. When everything is downloaded and installed nicely move on to step 2.'
          },
          {
            name: '2. Configure OBS',
            value: "There's a couple of settings which should be configured to ensure quality:\n\n**2.1** Set up recording output\nFrom the main OBS hud click on file>settings>output and look where the recordings is going to be put, and if you want change it to wherever you want. You can also change the recording quality and format here, but it’s recommended leave it as is (\"same as stream\" and \"mp4\").\n\n**2.2** Set up recording video quality\nIn settings click on Video and here you should see a couple of options. Depending on how powerful your system is you can chose different settings here, but the absolute minimum recording settings to get \"generally acceptable\" quality is 720p (1280x720) at 30 fps. But as said, this is up to personal preference and how much performance you wish to dedicate to recording instead of getting higher fps in game. Higher recording quality = less fps in game.\n\n**3.3** Set up hotkeys (optional)\nThis is also for personal preference, but click through the hotkeys screen to get accustomed with."
          },
          {
            name: '3. Configure OBS scenes',
            value: 'After hitting "apply" and closed down the settings, now you should have the main hud open and we want to create a scene. A scene is basically what you see the streams "swapping between" when they go from say a caster desk to in game and you can have as many as you want. But yet again, for simplicity’s sake, we’ll only make one.\nNow start Overwatch and alt-tab back to the OBS hud.\nRight click the "Scenes box" -> press add. Now right click the "Sources box" and pick "game capture" and name it "Overwatch". Then you should get a "properties for ‘Overwatch’" popup window. In this window, click on the "mode" dropdown menu and pick "capture specific window". Then a dropdown menu should appear called "window", click this and find Overwatch in the list, click okay.\nNow if Overwatch is the only source in the scene, it should be shown live in the main OBS hud window. If you wish to resize the window, click the ‘Overwatch’ source in the "sources box" and you’ll notice a red box which you can move about as you wish.'
          },
          {
            name: '4. Recording a game',
            value: "Final step is to press \"Start recording\" and you’ll start recording your Overwatch gameplay! The same button will stop recording once you're done."
          },
          {
            name: '5. Upload to youtube',
            value: "Go to [the youtube upload page](https://www.youtube.com/upload) and log in or sign up. You can change the privacy to unlisted so only those who have the link can access the video. Now choose your file and upload it. Once it's done you will have the link to paste in <#293163465441280000>"
          }
        ],
        footer: {
          icon_url: 'https://cdn.discordapp.com/icons/293161643674828800/cc1679307fd21c6d554fc56a3f598b78.jpg',
          text: 'If you have any questions feel free to ask!'
        }
      }).then(() => {
        if (msg.channel.type === 'text') msg.reply('Instructions have been sent to your DMs.')
      })
      break
    default:
      msg.reply(`We have guides to record with shadowplay (NVIDIA only) and OBS. Do \`${msg.guildConf.prefix}record [shadowplay||obs]\` and I will send you the guide. `)
  }
}

exports.conf = {
  enabled: true,
  runIn: ['text', 'dm', 'group'],
  aliases: ['rec'],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: []
}

exports.help = {
  name: 'record',
  description: 'Gives you instructions on how to record and publish your gameplay for others to review',
  extendedHelp: 'Currently we have a guide for OBS and a guide for Shadowplay (NVIDIA GPU only)',
  usage: '[platform:string]',
  usageDelim: ''
}
