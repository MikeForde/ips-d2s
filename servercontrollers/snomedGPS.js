const { Op } = require('sequelize');
const SnomedGPS = require('../models/SnomedGPS');

const parseLimit = (value, defaultValue = 25, maxValue = 200) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return defaultValue;
  return Math.min(parsed, maxValue);
};

const escapeLike = (value = '') => value.replace(/[\\%_]/g, '\\$&');

const PROJECTION = ['code', 'term_clean', 'term', 'semantic_tag'];

const toMongoShape = (record) => ({
  code: record.code,
  term_clean: record.term_clean,
  term: record.term,
  semantic_tag: record.semantic_tag,
});

const getSemanticTagFilter = (tag) => {
  switch ((tag || '').trim().toLowerCase()) {
    case '':
      return {};

    case 'condition':
      return {
        semantic_tag: {
          [Op.in]: ['disorder', 'finding'],
        },
      };

    case 'medication':
      return {
        semantic_tag: {
          [Op.in]: ['clinical drug', 'medicinal product', 'medicinal product form'],
        },
      };

    case 'allergyintolerance':
      return {
        semantic_tag: 'substance',
      };

    case 'immunization':
      return {
        semantic_tag: {
          [Op.in]: ['medicinal product', 'medicinal product form'],
        },
        term_clean: {
          [Op.like]: 'Vaccine product containing%',
        },
      };

    case 'observation':
      return {
        semantic_tag: 'observable entity',
      };

    default:
      return {
        semantic_tag: (tag || '').trim(),
      };
  }
};

const buildContainsFilter = (q) => ({
  [Op.or]: [
    { term_clean: { [Op.like]: `%${escapeLike(q)}%` } },
    { term: { [Op.like]: `%${escapeLike(q)}%` } },
    { code: { [Op.like]: `%${escapeLike(q)}%` } },
  ],
});

const buildSearchFilter = (tag, q) => {
  const trimmedTag = (tag || '').trim();
  const trimmedQ = (q || '').trim();

  const baseFilter = getSemanticTagFilter(trimmedTag);

  if (!trimmedQ) {
    return baseFilter;
  }

  if (trimmedTag.toLowerCase() === 'allergyintolerance') {
    return {
      [Op.or]: [
        {
          semantic_tag: {
            [Op.in]: ['substance', 'medicinal product'],
          },
          ...buildContainsFilter(trimmedQ),
        },
        {
          semantic_tag: 'disorder',
          term_clean: {
            [Op.like]: `Allergy to ${escapeLike(trimmedQ)}%`,
          },
        },
      ],
    };
  }

  return {
    ...baseFilter,
    ...buildContainsFilter(trimmedQ),
  };
};

const getSnomedTags = async (req, res) => {
  try {
    const tags = await SnomedGPS.findAll({
      attributes: ['semantic_tag'],
      where: {
        semantic_tag: {
          [Op.and]: {
            [Op.ne]: '',
            [Op.not]: null,
          },
        },
      },
      group: ['semantic_tag'],
      order: [['semantic_tag', 'ASC']],
      raw: true,
    });

    res.json(tags.map((row) => row.semantic_tag).filter(Boolean));
  } catch (err) {
    console.error('getSnomedTags error:', err);
    res.status(500).json({ error: 'Failed to retrieve SNOMED semantic tags' });
  }
};

const getSnomedByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const concept = await SnomedGPS.findOne({
      where: { code },
      attributes: PROJECTION,
      raw: true,
    });

    if (!concept) {
      return res.status(404).json({ error: 'SNOMED concept not found' });
    }

    res.json(toMongoShape(concept));
  } catch (err) {
    console.error('getSnomedByCode error:', err);
    res.status(500).json({ error: 'Failed to retrieve SNOMED concept' });
  }
};

const getSnomedPicklistByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const limit = parseLimit(req.query.limit, 100, 1000);

    const results = await SnomedGPS.findAll({
      where: getSemanticTagFilter(tag),
      attributes: PROJECTION,
      order: [['term_clean', 'ASC']],
      limit,
      raw: true,
    });

    res.json(results.map(toMongoShape));
  } catch (err) {
    console.error('getSnomedPicklistByTag error:', err);
    res.status(500).json({ error: 'Failed to retrieve SNOMED picklist' });
  }
};

const searchSnomedGPS = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const tag = (req.query.tag || '').trim();
    const limit = parseLimit(req.query.limit, 25, 200);

    const results = await SnomedGPS.findAll({
      where: buildSearchFilter(tag, q),
      attributes: PROJECTION,
      order: [['term_clean', 'ASC']],
      limit,
      raw: true,
    });

    res.json(results.map(toMongoShape));
  } catch (err) {
    console.error('searchSnomedGPS error:', err);
    res.status(500).json({ error: 'Failed to search SNOMED GPS' });
  }
};

module.exports = {
  getSnomedTags,
  getSnomedByCode,
  getSnomedPicklistByTag,
  searchSnomedGPS,
};
