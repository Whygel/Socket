
using System;
using System.Collections.Generic;

namespace RandomNumbers
{
	public class RandomNumbersService
	{
		private readonly string[] _companies = new[] { "Apple", "Google", "Tesla", "JP Morgan", "Microsoft" };
		private readonly Random _rng = new();

		public Dictionary<string, int> Generate()
		{
			var result = new Dictionary<string, int>();
			foreach (var c in _companies)
			{
				result[c] = _rng.Next(0, 1000);
			}
			return result;
		}


		private class TransactionJSON
		{
			public string Company { get; set; }
			public int Value { get; set; }
			public byte[] Logo { get; set; }
		}
	}
}