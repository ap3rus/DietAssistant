using System;
using System.Collections.Generic;
using System.Linq;

namespace FoodParsers
{
    class Program
    {
        static void Main(string[] args)
        {
            var parser = new UsdaFileParser();
            var set1 = parser.Parse(@"C:\Users\vladn\Downloads\foods-fatprotcarb.csv", NutrientType.Fats, NutrientType.Proteins, NutrientType.Carbs);
            var set2 = parser.Parse(@"C:\Users\vladn\Downloads\foods-sugarfibersodium.csv", NutrientType.Sugars, NutrientType.Fiber, NutrientType.Sodium);
            var set3 = parser.Parse(@"C:\Users\vladn\Downloads\foods-fats.csv", NutrientType.SaturatedFats, NutrientType.PolyunsaturatedFats, NutrientType.MonounsaturatedFats);

            var set1ById = set1.ToDictionary(s => s.Id, s => s);
            var set2ById = set2.ToDictionary(s => s.Id, s => s);
            var set3ById = set3.ToDictionary(s => s.Id, s => s);

            var result = new Dictionary<string, Nutrition>();

            foreach (var item in new[] { set1ById, set2ById, set3ById }.SelectMany(i => i))
            {
                Nutrition nutrition;
                if (!result.TryGetValue(item.Key, out nutrition))
                {
                    result[item.Key] = item.Value;
                }
                else
                {
                    nutrition.Nutrients.AddRange(item.Value.Nutrients);
                }
            }

            System.IO.File.WriteAllText(@"C:\Users\vladn\Downloads\foods.json", Newtonsoft.Json.JsonConvert.SerializeObject(result.Values));
        }
    }
}
