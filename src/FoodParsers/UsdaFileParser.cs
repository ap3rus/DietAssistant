using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace FoodParsers
{
    class UsdaFileParser
    {
        public IList<Nutrition> Parse(string fileName, NutrientType nutrientType1, NutrientType nutrientType2, NutrientType nutrientType3)
        {
            var result = new List<Nutrition>();
            using (var file = File.OpenText(fileName))
            {
                var csv = new CsvHelper.CsvReader(file);
                while (csv.Read())
                {
                    var id = csv.GetField<string>(0);
                    var name = csv.GetField<string>(1);
                    var nutrient1Str = csv.GetField<string>(2);
                    var nutrient2Str = csv.GetField<string>(3);
                    var nutrient3Str = csv.GetField<string>(4);
                    var nutrients = new List<Nutrient>();
                    decimal nutrient1, nutrient2, nutrient3;
                    if (decimal.TryParse(nutrient1Str, out nutrient1))
                    {
                        nutrients.Add(new Nutrient { Grams = nutrient1, Type = nutrientType1 });
                    }
                    if (decimal.TryParse(nutrient2Str, out nutrient2))
                    {
                        nutrients.Add(new Nutrient { Grams = nutrient2, Type = nutrientType2 });
                    }
                    if (decimal.TryParse(nutrient3Str, out nutrient3))
                    {
                        nutrients.Add(new Nutrient { Grams = nutrient3, Type = nutrientType3 });
                    }

                    result.Add(new Nutrition
                    {
                        Id = id,
                        Name = name,
                        Nutrients = nutrients
                    });
                }
            }

            return result;
        }
    }
}
