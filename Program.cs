using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using RandomNumbers;
using System.IO;

// Zum SChlißen des Websocket : Strg + C im Terminal
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseWebSockets();
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var socket = await context.WebSockets.AcceptWebSocketAsync();
        var generator = new RandomNumbersService();

        while (socket.State == WebSocketState.Open)
        {
            var transactions = generator.Generate();
            var json = JsonSerializer.Serialize(transactions);
            var message = Encoding.UTF8.GetBytes(json);
            await socket.SendAsync(
                message,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
            await Task.Delay(1000);
        }
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

app.Run();
