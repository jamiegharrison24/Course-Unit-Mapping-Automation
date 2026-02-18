Backend.Unit.AIMatch = async function (unitSRC, unitsToCompare) {
    /** 
     * @param {JSON} unitSRC
     * @param {JSON} unitsToCompare
     * 
     * Makes a post request to server side gemini api code
    */

    try {
        const url = new URL("http://127.0.0.1:3000" + pathname + "/geminiMatch");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "unitSRC":unitSRC,
                "unitsToCompare":unitsToCompare
            }),
        });

        // Extract the response code
        const statusCode = response.status;

        const result = await response.json();
        return { result: result, status: statusCode };
    } catch (error) {
        console.log("Error:", error);
    }
}







// Prompt example: 
//   `Please analyse the similarity between this unit: 
  
// {
//   "FIT3171":{
//     "unitTitle":"Databases",
//     "unitDescription":"This unit will provide an introduction to the concepts of database design and usage and the related issues of data management. You will develop skills in planning, designing, and implementing a data model using an enterprise-scale relational database system (Oracle). Methods and techniques will also be presented to populate, retrieve, update and implement integrity features on data in the implemented database system.",
//   }
// }
  
//   And the following units
  
// {
//  "FIT5137":{
//     "unitTitle":"Advanced database technology",
//     "unitDescription":"This unit examines advanced database technology. This unit particularly covers three main types of advanced database technologies, including (i) document store, (ii) wide column store, and (iii) graph database. These three systems represent the broad spectrum of NoSQL databases. The underlying theoretical foundations, such as database modelling", 
//  },
//  "FIT5129":{
//     "unitTitle":"Cyber operations",
//     "unitDescription":"An effective cybersecurity practitioner requires knowledge from multiple disciplines, including computer science, mathematics, psychology, sociology, criminology, law, economics, and engineering. This unit considers the intersection of the technical, psychological, and sociological aspects involved in maintaining security within organisations. The unit will provide students with practical foundations in planning secure networks, policy-based operations, and the implementation of security. Students will also be introduced to best practices in dealing with security breaches. Critical reflective and practical skills will be acquired through reflective reading and considering real-world applications.",
//  }
// }
  
  
//   Please provide your results in a json object with the keys being the unit codes of each unit and their respective value an integer in range [1,10]. Do not provide any other text aside from this json object.  
//   `