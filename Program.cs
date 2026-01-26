using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using RandomNumbers;
using System.IO;

// Zum SChlißen des Websocket : Strg + C im Terminal
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

Random random = new Random();
double currentPrice = 100.0;
double StockAmount = 10000/currentPrice;
DateTime currentDate = new DateTime(2015, 12, 1); // Startdatum
app.UseWebSockets();
app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var socket = await context.WebSockets.AcceptWebSocketAsync();
        var generator = new RandomNumbersService();

        while (socket.State == WebSocketState.Open)
        {
            if(false)
            {
            // var transactions = generator.Generate();
            var transactions = generator.GenerateMonthly();
            var json = JsonSerializer.Serialize(transactions);
            var message = Encoding.UTF8.GetBytes(json);
            await socket.SendAsync(
                message,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
            }
            else{
                // Preis und Datum aktualisieren
            currentPrice += (random.NextDouble() - 0.5) * 2;
            currentDate = currentDate.AddDays(1); // Einen Tag hochsetzen

            var stockData = new
            {
                time = currentDate.ToString("o"), // ISO-Format
                price = Math.Round(currentPrice, 2),
                Value = currentPrice * StockAmount
            };
            var json =  JsonSerializer.Serialize(stockData);
            var buffer = Encoding.UTF8.GetBytes(json);
            await socket.SendAsync(
                new ArraySegment<byte>(buffer),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
            }
            await Task.Delay(100);
        }
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

app.Run();
