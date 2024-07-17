import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';

import { calculateEndDate, Medication } from '@common/models/shared/Medication';
import { AppDispatch, AppState } from '@store/ReduxStore';
import { create as createMedication, update as updateMedication } from '@store/medication/reducer';
import { ServiceState } from '@store/service/reducer';
import { CreateStartPayload } from '@store/medication/middleware';
// eslint-disable-next-line import/no-cycle
import { MedicationsScreenProps } from '@components/Router.tsx';
import usePrevious from '@components/hooks/usePrevious';
import { isDefinedObject, parser, ParserConfig } from '@components/form/Parser';
import { ErrorsObject, validator, ValidatorConfig } from '@components/form/Validator';

import Styles from './AddEditMedication.styles';

interface AddEditForm {
    name: string;
    description: string;
    frequency: {
        amount: string;
        days: string
    },
    count: string;
    destinationCount: string;
    startDate: Date | null;
}

const numberParser = (value: string) => parseInt(value, 10);

const parserConfig: ParserConfig<CreateStartPayload, AddEditForm> = {
  name: (value) => value || undefined,
  description: (value) => value || null,
  frequency: parser({
    amount: numberParser,
    days: numberParser,
  }),
  count: numberParser,
  destinationCount: numberParser,
  startDate: (value) => value ?? undefined,
};

const numberValidator = (value: number | undefined) => ((value === undefined || Number.isNaN(value)) ? 'Should be a number' : undefined);
const frequencyValidator = validator({ amount: numberValidator, days: numberValidator });
const countValidator = (
  value: number | undefined,
  { destinationCount }: { destinationCount: number | undefined },
) => numberValidator(value) ?? ((value ?? 0) > (destinationCount ?? 0) ? 'Should be not greater than Destination Count' : undefined);
const destinationCountValidator = (
  value: number | undefined,
  { count }: { count: number | undefined },
) => numberValidator(value) ?? ((value ?? 0) < (count ?? 0) ? 'Should be not less than Count' : undefined);
const startDateValidator = (value: Date | undefined) => (!value ? 'Should not be empty' : undefined);

const validatorConfig: ValidatorConfig<CreateStartPayload> = {
  name: (value) => (!value || value.length === 0 ? 'Should not be empty' : undefined),
  description: () => undefined,
  frequency: frequencyValidator,
  count: countValidator,
  destinationCount: destinationCountValidator,
  startDate: startDateValidator,
};

type CalculateModelParams = Pick<CreateStartPayload, 'startDate' | 'frequency' | 'count' | 'destinationCount'>;
type CalculateFormParams = Pick<AddEditForm, 'startDate' | 'frequency' | 'count' | 'destinationCount'>;

function useEndDate(params: CalculateFormParams) {
  const data = parser<CalculateModelParams, CalculateFormParams>({
    startDate: parserConfig.startDate,
    frequency: parserConfig.frequency,
    count: parserConfig.count,
    destinationCount: parserConfig.destinationCount,
  })(params);

  const errors = validator<CalculateModelParams>({
    startDate: startDateValidator,
    frequency: frequencyValidator,
    count: countValidator,
    destinationCount: destinationCountValidator,
  })(data);
  if (errors.startDate) return 'Specify Start Date';
  if (errors.destinationCount) return 'Specify Destination Count';
  if (errors.frequency?.amount) return 'Specify Frequency Amount';
  if (errors.frequency?.days) return 'Specify Frequency Days';

  if (isDefinedObject(data) && Object.keys(errors).length === 0) {
    return calculateEndDate(data.startDate, data.count, data.destinationCount, data.frequency);
  }
  return undefined;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const AddEditMedication: FunctionComponent<MedicationsScreenProps<'AddEditMedication'>> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();

  const medication = useSelector<AppState, Medication | undefined>((state) => (route.params.id
    ? state.medication.medications[route.params.id] : undefined));
  const serviceState = useSelector<AppState, ServiceState>((state) => state.service);

  const prevIsFetching = usePrevious(serviceState.isFetching);

  const [name, setName] = useState(medication?.data.name ?? '');
  const [description, setDescription] = useState(medication?.data.description || '');
  const [amount, setAmount] = useState(medication?.data.frequency.amount.toString() ?? '1');
  const [days, setDays] = useState(medication?.data.frequency.days.toString() ?? '1');
  const [count, setCount] = useState(medication?.data.count.toString() ?? '0');
  const [destinationCount, setDestinationCount] = useState(medication?.data.destinationCount.toString() ?? '');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(medication?.data.startDate ?? null);

  const endDate = useEndDate({
    startDate, count, destinationCount, frequency: { amount, days },
  });

  const [errors, setErrors] = useState<ErrorsObject<CreateStartPayload>>({});

  const handleSubmit = () => {
    const data = parser(parserConfig)({
      name, description, frequency: { amount, days }, count, destinationCount, startDate,
    });
    const validationResult = validator(validatorConfig)(data);
    setErrors(validationResult);

    if (isDefinedObject(data) && Object.keys(validationResult).length === 0) {
      if (route.params.id) {
        dispatch(updateMedication({ id: route.params.id, data }));
      } else {
        dispatch(createMedication(data));
      }
    }
  };

  useEffect(() => {
    if (prevIsFetching === true && !serviceState.isFetching && serviceState.error === null) {
      navigation.navigate('Medications');
    }
  }, [serviceState.isFetching]);

  return (
    <SafeAreaView style={Styles.addEditRoot}>
        <ScrollView>
            <View style={Styles.formWrapper}>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Name*</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="none"
                    />
                    {errors.name && <Text style={Styles.fieldError}>{errors.name}</Text>}
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Description</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        multiline
                        value={description}
                        onChangeText={setDescription}
                        autoCapitalize="none"
                    />
                </View>
                <View style={Styles.frequencyWrapper}>
                    <View style={[Styles.fieldWrapper, Styles.frequencyFieldWrapper]}>
                        <Text style={Styles.fieldLabel}>Amount*</Text>
                        <TextInput
                            style={[Styles.inputField, Styles.textInputField]}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        {errors.frequency?.amount && <Text style={Styles.fieldError}>
                            {errors.frequency?.amount}
                        </Text>}
                    </View>
                    <View style={[Styles.fieldWrapper, Styles.frequencyFieldWrapper]}>
                        <Text style={Styles.fieldLabel}>Days*</Text>
                        <TextInput
                            style={[Styles.inputField, Styles.textInputField]}
                            keyboardType="numeric"
                            value={days}
                            onChangeText={setDays}
                        />
                        {errors.frequency?.days
                            && <Text style={Styles.fieldError}>{errors.frequency?.days}</Text>}
                    </View>
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Initial Count*</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        keyboardType="numeric"
                        value={count}
                        onChangeText={setCount}
                    />
                    {errors.count && <Text style={Styles.fieldError}>{errors.count}</Text>}
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Destination Count*</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        keyboardType="numeric"
                        value={destinationCount}
                        onChangeText={setDestinationCount}
                    />
                    {errors.destinationCount && <Text style={Styles.fieldError}>
                        {errors.destinationCount}
                    </Text>}
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Start Date*</Text>
                    <TouchableOpacity
                        style={Styles.inputField}
                        onPress={() => setDatePickerOpen(true)}
                    >
                        <Text
                            style={[
                              Styles.textInputField,
                              ...(startDate == null ? [Styles.datePickerTextPlaceholder] : []),
                            ]}
                        >
                            {startDate ? formatDate(startDate) : 'Click to Select'}
                        </Text>
                    </TouchableOpacity>
                    {errors.startDate && <Text style={Styles.fieldError}>
                        {errors.startDate}
                    </Text>}
                    <DatePicker
                        modal
                        open={isDatePickerOpen}
                        mode="date"
                        title="Select Start Date"
                        date={startDate ?? new Date()}
                        onConfirm={(date) => {
                          setDatePickerOpen(false);
                          setStartDate(date);
                        }}
                        onCancel={() => {
                          setDatePickerOpen(false);
                        }}
                    />
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>End Date</Text>
                    <View style={Styles.inputField}>
                        <Text
                            style={[
                              Styles.textInputField,
                              ...(endDate instanceof Date
                                ? []
                                : [Styles.datePickerTextPlaceholder]),
                            ]}
                        >
                            {endDate && endDate instanceof Date ? formatDate(endDate) : (endDate ?? '')}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={Styles.submitButton} onPress={handleSubmit}>
                    <Text style={Styles.submitButtonText}>{route.params.id ? 'Save' : 'Create'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditMedication;
