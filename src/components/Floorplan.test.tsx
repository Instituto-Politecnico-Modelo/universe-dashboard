import ReactThreeTestRenderer from '@react-three/test-renderer';
import '@testing-library/jest-dom';
import { MeshComponent } from './Floorplan';

describe('Floorplan', () => {
    it('should render the Floorplan MeshComponent', async () => {
        const renderer = await ReactThreeTestRenderer.create(<MeshComponent rotate={false} data={[]} />);
        // check if the Floorplan component is rendered
        expect(renderer).toBeDefined();
    });
});
