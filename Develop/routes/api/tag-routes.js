// const router = require('express').Router();
// const { Tag, Product, ProductTag } = require('../../models');

// // The `/api/tags` endpoint

// router.get('/', (req, res) => {
//   // find all tags
//   // be sure to include its associated Product data
// });

// router.get('/:id', (req, res) => {
//   // find a single tag by its `id`
//   // be sure to include its associated Product data
// });

// router.post('/', (req, res) => {
//   // create a new tag
// });

// router.put('/:id', (req, res) => {
//   // update a tag's name by its `id` value
// });

// router.delete('/:id', (req, res) => {
//   // delete on tag by its `id` value
// });

// module.exports = router;


const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated tag data
try {
  const tags = await tag.findAll({
    attributes: ['id', 'tag_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        as: 'category'
      },
      {
        model: Tag,
        as: 'tags',
        attributes: ["id", "tag_name"],
        through: {
          attributes: []
        }
      }
    ]
  });
  res.send(200).json(tags);
  // res.send(200).send(tags.toJSON());

} catch(err) {
  console.error(err);
  res.sendStatus(500);
}
});

// get one tag
router.get('/:id', async (req, res) => {
// find a single tag by its `id`
// be sure to include its associated Category and Tag data
try {
  const tag = await tag.findByPk(req.params.id,{
    attributes: ['id', 'tag_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        as: 'category'
      },
      {
        model: Tag,
        as: 'tags',
        attributes: ["id", "tag_name"],
        through: {
          attributes: []
        }
      }
    ]
  });

  if(!tag) {
    res.sendStatus(404);
  } else {
    res.status(200).send(tag.toJSON());
  }
} catch(err) {
  console.error(err);
  res.sendStatus(500); 
}
});

// create new tag
router.post('/', (req, res) => {
/* req.body should look like this...
  {
    tag_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
  }
*/
tag.create(req.body)
  .then((tag) => {
  
    if (req.body.tagIds.length) {
      const tagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          tag_id: tag.id,
          tag_id,
        };
      });
      return tag.bulkCreate(tagIdArr);
    }
    // if no tag tags, just respond
    res.status(200).json(tag);
  })
  .then((tagIds) => res.status(200).json(tagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// update tag
router.put('/:id', (req, res) => {
// update tag data
tag.update(req.body, {
  where: {
    id: req.params.id,
  },
})
  .then((tag) => {
    // find all associated tags from tag
    return tag.findAll({ where: { tag_id: req.params.id } });
  })
  .then((tags) => {
    // get list of current tag_ids
    const tagIds = tags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newtags = req.body.tagIds
      .filter((tag_id) => !tagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          tag_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const tagsToRemove = tags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    return Promise.all([
      tag.destroy({ where: { id: tagsToRemove } }),
      tag.bulkCreate(newtags),
    ]);
  })
  .then((updatedtags) => res.json(updatedtags))
  .catch((err) => {
    // console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
// delete one tag by its `id` value
try {
  const tag = await tag.findByPk(req.params.id);

  if (tag) {
    await tag.destroy();
  }

  res.sendStatus(200);
} catch(err) {
  console.log(`router.delete(${req.params.id}): error`, err);
  res.sendStatus(500);
}
});

module.exports = router;
