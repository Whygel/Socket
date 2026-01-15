
using System;
using System.Collections.Generic;
using System.IO;

namespace RandomNumbers
{
	public class RandomNumbersService
	{
		private readonly string[] _companies = new[] { "Apple", "Google", "Tesla", "JP Morgan", "Microsoft", "Siemens", "BASF", "Bayer", "Shell", "Mearsk" };
		private readonly Random _rng = new();
		private readonly Dictionary<string, byte[]> _logos = new();
		private readonly Dictionary<string, int> _lastValues = new();

		public RandomNumbersService()
		{
			var logoMappings = new Dictionary<string, string>
			{
				["Apple"] = "Apple.png",
				["Google"] = "Google__G__logo.svg.png",
				["Tesla"] = "Tesla.png",
				["JP Morgan"] = "JPMorgan.png",
				["Microsoft"] = "Microsoft_logo.svg.png",
				["Siemens"] = "Siemens-Logo.png",
				["BASF"] = "BASF.png",
				["Bayer"] = "Bayer-Logo-2010.png",
				["Shell"] = "Shell.png",
				["Mearsk"] = "Mearsk.png"

							
			};
			foreach (var company in _companies)
			{
				var path = Path.Combine("Logos", logoMappings[company]);
				_logos[company] = File.ReadAllBytes(path);
				_lastValues[company] = _rng.Next(0, 1000);
			}
		}

		public List<TransactionJSON> Generate()
		{
			var result = new List<TransactionJSON>();
			foreach (var c in _companies)
			{
				var newValue = (int)(_lastValues[c] * (0.9 + _rng.NextDouble() * 0.2));
				_lastValues[c] = newValue;
				result.Add(new TransactionJSON
				{
					Company = c,
					Value = newValue,
					Logo = _logos[c]
				});
			}
			return result;
		}
	}
		public  class TransactionJSON
		{
			public string Company { get; set; }
			public int Value { get; set; }
			public byte[] Logo { get; set; }
		}
}