/* eslint-disable no-param-reassign */
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  InputGroup,
  InputRightAddon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { FormInput } from 'chakra-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';

import { importFromLocalStorage, saveToLocalStorage } from './services';
import {
  getPertAverage,
  getPertVariance,
  getTotalVariance,
} from './statistics';

const DEFAULT_TASK: Pert.Task = {
  name: '',
  optimisticEstimate: 0,
  likelyEstimate: 0,
  pessimisticEstimate: 0,
};

const DEFAULT_FORM_STATE: Pert.FormState = {
  unit: 'days',
  tasks: [DEFAULT_TASK],
};

const PertTable = () => {
  const toast = useToast({ position: 'bottom', isClosable: true });

  const { control, register, watch, handleSubmit, setValue } =
    useForm<Pert.FormState>({
      mode: 'all',
      defaultValues: DEFAULT_FORM_STATE,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });

  // TODO: improve performance
  const { optimisticSum, likelySum, pessimisticSum } = watch('tasks').reduce(
    (sum, task) => {
      sum.optimisticSum += task.optimisticEstimate || 0;
      sum.likelySum += task.likelyEstimate || 0;
      sum.pessimisticSum += task.pessimisticEstimate || 0;
      return sum;
    },
    {
      optimisticSum: 0,
      likelySum: 0,
      pessimisticSum: 0,
    },
  );

  const handleAdd = () => {
    append(DEFAULT_TASK);
  };

  const handleSave = handleSubmit((values) => {
    saveToLocalStorage(values);
    toast({ title: 'Save to local storage', status: 'success' });
  });
  const handleImport = () => {
    const newFormState = importFromLocalStorage(DEFAULT_FORM_STATE);

    setValue('unit', newFormState.unit);
    setValue('tasks', newFormState.tasks);
    toast({ title: 'Imported from local storage', status: 'success' });
  };

  return (
    <Box as="form" onSubmit={handleSave}>
      <FormInput register={register} name="unit" label="Unit" />
      <TableContainer my="8">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th />
              <Th>Task Name</Th>
              <Th>
                <Tooltip label="Optimistic Estimate">Optimistic</Tooltip>
              </Th>
              <Th>
                <Tooltip label="Most Likely Estimate">Most Likely</Tooltip>
              </Th>
              <Th>
                <Tooltip label="Pessimistic Estimate">Pessimistic</Tooltip>
              </Th>
              <Th>
                <Tooltip label="Weighted Average">Estimate</Tooltip>
              </Th>
              <Th>
                <Tooltip label="&plusmn;1 = 68%, &plusmn;2 = 95%">
                  Sigma
                </Tooltip>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((field, index) => {
              const optimisticIndex =
                `tasks.${index}.optimisticEstimate` as const;
              const likelyIndex = `tasks.${index}.likelyEstimate` as const;
              const pessimisticIndex =
                `tasks.${index}.pessimisticEstimate` as const;

              const optimisticEstimate = watch(optimisticIndex);
              const likelyEstimate = watch(likelyIndex);
              const pessimisticEstimate = watch(pessimisticIndex);

              const average = getPertAverage(
                optimisticEstimate,
                likelyEstimate,
                pessimisticEstimate,
              );
              const variance = getPertVariance(
                optimisticEstimate,
                pessimisticEstimate,
              );

              return (
                <Tr key={field.id} gap={2}>
                  <Td>
                    <IconButton
                      data-testid={`remove-${index}`}
                      colorScheme="red"
                      rounded="full"
                      aria-label="Remove this row"
                      disabled={fields.length === 1}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Icon as={IoIosRemove} />
                    </IconButton>
                  </Td>
                  <Td>
                    <FormInput
                      data-testid={`task-${index}-name`}
                      name={`tasks.${index}.name`}
                      register={register}
                    />
                  </Td>
                  <Td>
                    <InputGroup>
                      <FormInput
                        data-testid={`task-${index}-optimistic`}
                        type="number"
                        min="0"
                        step="0.01"
                        name={optimisticIndex}
                        register={register}
                        options={{ valueAsNumber: true }}
                      />
                      <InputRightAddon>{watch('unit')}</InputRightAddon>
                    </InputGroup>
                  </Td>
                  <Td>
                    <InputGroup>
                      <FormInput
                        data-testid={`task-${index}-likely`}
                        type="number"
                        step="0.01"
                        min={optimisticEstimate}
                        name={likelyIndex}
                        register={register}
                        options={{ valueAsNumber: true }}
                      />
                      <InputRightAddon>{watch('unit')}</InputRightAddon>
                    </InputGroup>
                  </Td>
                  <Td>
                    <InputGroup>
                      <FormInput
                        data-testid={`task-${index}-pessimistic`}
                        type="number"
                        step="0.01"
                        min={likelyEstimate}
                        name={pessimisticIndex}
                        register={register}
                        options={{ valueAsNumber: true }}
                      />
                      <InputRightAddon>{watch('unit')}</InputRightAddon>
                    </InputGroup>
                  </Td>
                  <Td data-testid={`task-${index}-average`} isNumeric>
                    {average.toFixed(2)}
                  </Td>
                  <Td data-testid={`task-${index}-variance`} isNumeric>
                    {variance.toFixed(2)}
                  </Td>
                </Tr>
              );
            })}
            <Tr>
              <Td>
                <IconButton
                  data-testid="append"
                  colorScheme="green"
                  rounded="full"
                  aria-label="Add another row"
                  onClick={handleAdd}
                >
                  <Icon as={IoIosAdd} />
                </IconButton>
              </Td>
              <Td />
              <Td />
              <Td />
              <Td />
              <Td />
              <Td />
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th />
              <Th>summary</Th>
              <Th data-testid="optimistic-sum" isNumeric>
                {optimisticSum.toFixed(2)}
              </Th>
              <Th data-testid="likely-sum" isNumeric>
                {likelySum.toFixed(2)}
              </Th>
              <Th data-testid="pessimistic-sum" isNumeric>
                {pessimisticSum.toFixed(2)}
              </Th>
              <Th data-testid="tasks-average" isNumeric>
                {getPertAverage(
                  optimisticSum,
                  likelySum,
                  pessimisticSum,
                ).toFixed(2)}
              </Th>
              {/* TODO: improve performance */}
              <Th data-testid="tasks-variance" isNumeric>
                {getTotalVariance(
                  ...watch('tasks').map((task) =>
                    getPertVariance(
                      task.optimisticEstimate,
                      task.pessimisticEstimate,
                    ),
                  ),
                ).toFixed(2)}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <HStack justify="center" spacing={8}>
        <Button type="submit">Save within Browser</Button>
        <Button onClick={handleImport}>Import from Browser</Button>
      </HStack>
    </Box>
  );
};
export default PertTable;
