public class StringArrayTest {
	
	public static List<String> generateStringArray(Integer length){
		List<String> word = new List<String>();
		for(Integer i = 0; i < length; i++){
			word.add('Test ' + i);
		}
		return word;
	}
}