# demo-webstore-api (WIP)
An Express backend for my Demo Webstore project. 

Note that the project is still heavily WIP, so consistency, security, and polish is not there yet. This is a crude draft.

The database gets reset on a regular basis to delete any modifications made in testing.

## Features
- Support for limiting and ordering results based on a parameter
- User authentication using bcrypt to secure passwords and an express-session token to keep the user logged in
- File uploads using express-fileupload

- Everything except the files are stored in a mysql database hosted on plantetscale.
- Uploaded files are stored in a Cloudflare R2 bucket

## Usage

### Routes
```/```: The root, where you can find information about the project and API.

```/api/*```: The different API routes corresponding to database tables and views.

Some notable ones:

#### product_expanded_v2
```/api/product_expandedV2```: Returns a list of products that have all relevant information already attached including ```categories```, ```reviews``` and ```images```. The resulting json will look along the lines of: 
```json
{
  "data":[
    {
      "product_id":1,
      "product_name":"iFruit 12",
      "product_description":"The iFruit 12 is a sleek and stylish device that offers a range of features. With its high-resolution display and powerful camera, it is perfect for capturing memories and staying connected.",
      "price":99900,
      "discount":10,
      "product_stock":100,
      "event":{
        "event_id":-1,
        "event_name":null,
        "event_description":null,
        "event_start_date":null,
        "event_end_date":null
      },
      "categories":[
        {
          "category_id":1,
          "category_name":"Smartphones",
          "category_description":"Smartphones from various manufacturers"
        }
      ],
      "manufacturers":[
        {
          "manufacturer_id":1,
          "manufacturer_name":"Pear Inc."
        }
      ],
      "images":[
        {
          "image_id":1,
          "image_source":"iFruit_12_front.png",
          "image_type_id":2,
          "image_description":"Front view of iFruit 12",
          "image_link":null
        },
        {
          "image_id":2,
          "image_source":"iFruit_12_back.png",
          "image_type_id":2,
          "image_description":"Back view of iFruit 12",
          "image_link":null
        }
      ],
      "reviews":[
        {
          "review_id":1,
          "user_id":-1,
          "review_rating":5,
          "review_description":"Absolutely love this phone. The camera quality is amazing and it runs so smoothly.",
          "review_helpful":null,
          "review_not_helpful":null
        },
        {
          "review_id":2,
          "user_id":-1,
          "review_rating":4,
          "review_description":"Good phone but a bit overpriced in my opinion.",
          "review_helpful":null,
          "review_not_helpful":null
        }
      ],
      "avg_review_rating":"4.5000"
    }
  ]
}
```

#### maincategory_expanded
```/api/maincategory_expanded``` Returns a list of maincategories that have all relevant information already attached including ```categories``` and ```images```. The resulting json will look along the lines of: 
```json
{
  "data":[
    {
      "maincategory_id":6,
      "maincategory_name":"Audio",
      "maincategory_description":"All kinds of audio",
      "image_id":48,
      "image_source":"audio_banner.jpg",
      "image_type_id":4,
      "image_description":null,
      "image_link":null,
      "categories":[
        {
          "category_id":5,
          "category_name":"Earbuds",
          "category_description":"Earbuds for smartphones and tablets"
        },
        {
          "category_id":13,
          "category_name":"Headphones",
          "category_description":"High quality audio and fidelity"
        },
        {
          "category_id":14,
          "category_name":"Speakers",
          "category_description":"Stereo and surround setups"
        },
        {
          "category_id":15,
          "category_name":"Microphones",
          "category_description":"Good quality for your Zoom or Discord"
        }
      ]
    }
  ]
}
```

## Running 

### Live
The API is live at https://dws-api.akulaurila.com

### Running locally
1. Clone the repository to your machine
2. Run ```npm install```
3. Run ```npm run dev```
4. The API is now running at ```localhost:5000``` by default
