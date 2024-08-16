import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { MeshComponent } from './Floorplan';


describe('Floorplan', () => {
    it('should render the Floorplan MeshComponent', async () => {
        const renderer = await ReactThreeTestRenderer.create(<MeshComponent hovered={false} data={[]} />);
        // check if the Floorplan component is rendered
        expect(renderer).toBeDefined();
    });
});