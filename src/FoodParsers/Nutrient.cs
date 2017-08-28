using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace FoodParsers
{
    class Nutrient
    {
        [JsonProperty("type")]
        public NutrientType Type { get; set; }

        [JsonProperty("grams")]
        public decimal Grams { get; set; }
    }
}
