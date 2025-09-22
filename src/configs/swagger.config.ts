import YAML from 'yamljs';
import path from 'path';

const filePath = path.join(__dirname, '..', '/docs/swagger.yaml');
const swaggerDocument = YAML.load(filePath);
export default swaggerDocument;
