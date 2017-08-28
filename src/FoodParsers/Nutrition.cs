using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace FoodParsers
{
    class Nutrition
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nutrients")]
        public List<Nutrient> Nutrients { get; set; }

        [JsonProperty("servings")]
        public object[] Servings { get; set; } = new object[0];
    }
}
