---
title: web如何调起exe程序
author: Potter
date: 2023-08-02 16:28:32

tags:

- C#

categories:

- Web
---

# web：如何调起exe程序


## H5 配置

```jsx
<a href="WebStartupExe:startup?a=b&c=2">Click to trigger</a>
```

- WebStartupExe：应用程序名
- startup：启动命令
- a=b&c=2：就是传给exe程序的参数

## exe程序需要往注册表中注册URL Protocol 启动命令

```csharp
using Microsoft.Win32;
using System;
using System.IO;
using System.Linq;

namespace WMConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Listening..");

            Console.WriteLine("args:");
            Console.WriteLine("---------------------------");
            foreach (var arg in args)
            {
                Console.WriteLine(arg);
            }
            Console.WriteLine("---------------------------");
            var parameters = string.Join("", args);
            Console.WriteLine("parameters:" + parameters.Substring(parameters.IndexOf("?") + 1));

            //Gets the current location where the file is downloaded
            var loc = System.Reflection.Assembly.GetExecutingAssembly().Location;
            if (!Directory.Exists(@"E:\Console\"))
            {
                System.IO.Directory.CreateDirectory(@"E:\Console\");
            }
            //Creates the Downloaded file in the specified folder
            if (!File.Exists(@"E:\Console\" + loc.Split('\\').Last()))
            {
                File.Move(loc, @"E:\Console\" + loc.Split('\\').Last());
            }
            var KeyTest = Registry.CurrentUser.OpenSubKey("Software", true).OpenSubKey("Classes", true);
            RegistryKey key = KeyTest.CreateSubKey("WebStartupExe");
            key.SetValue("URL Protocol", "startup");
            key.CreateSubKey(@"shell\open\command").SetValue("", "\"E:\\Console\\WebStartupExe.exe\" \"%1\"");
            Console.WriteLine("启动成功");
            Console.ReadKey();
        }
    }
}
```

## 参考文献

- [https://www.codeproject.com/Articles/1168356/Run-an-EXE-from-Web-Application](https://www.codeproject.com/Articles/1168356/Run-an-EXE-from-Web-Application)
- [https://stackoverflow.com/questions/3057576/how-to-launch-an-application-from-a-browser](https://stackoverflow.com/questions/3057576/how-to-launch-an-application-from-a-browser)
- [https://github.dev/vireshshah/custom-protocol-check](https://github.dev/vireshshah/custom-protocol-check)
- [https://blog.csdn.net/qq_30599613/article/details/93193809](https://blog.csdn.net/qq_30599613/article/details/93193809)
