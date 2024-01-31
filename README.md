RandomPictureAPI
=========

[![Issues](https://img.shields.io/github/issues/wh-iterabb-it/meowfacts.svg)](https://github.com/Larssies/RandomPictureAPI/issues)
[![License](https://img.shields.io/badge/license-GPL-blue.svg)](https://github.com/Larssies/RandomPictureAPI/blob/main/LICENSE)
[![Larssies](https://img.shields.io/badge/Author-Larssies-blue)](https://larssies.com/)


## Description:

This API provides random pictures for your applications or projects. It's easy to integrate and adds a touch of creativity to your content.

### Example Usage

``` 
curl https://api.larssies.com/random
```

Response

```json
{
  "url": "https://api.larssies.com/cdn/RANDOM_PICTURE/",
  "success": true
}
```

### Advanced Usage

You can request more than one picture at a time by using the GET param `count`

```bash
curl https://api.larssies.com/random?count=3
```

Response

```json
[
    {
        "url": "https://api.larssies.com/cdn/RANDOM_IMAGE_1",
        "success": true
    },
    {
        "url": "https://api.larssies.com/cdn/RANDOM_IMAGE_2",
        "success": true
    },
    {
        "url": "https://api.larssies.com/cdn/RANDOM_IMAGE_3",
        "success": true
    }
]
```


### Documentation

<div align="">
    <h3>- <a href="https://api.larssies.com/" type="_blank">Official Website</a></h3>
</div>


## Local Development

### Installation

```
npm install
```

Basic usage

```
npm run start
```

</div>


