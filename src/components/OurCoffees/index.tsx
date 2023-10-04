import { CoffeeCard } from '../CoffeeCard';
import { TitleText } from '../Typography';
import { CoffeeList, OurCoffeesContainer } from './styles';

import { coffees } from '../../mock/coffee';

export function OurCoffees() {
  return (
    <OurCoffeesContainer className='container'>
      <CoffeeList>
        {coffees.map((coffee) => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </CoffeeList>
    </OurCoffeesContainer>
  );
}
